import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '../db/db'
import {  type AiVisionInput, type AiVisionResult } from '../types/types'
import { Category, SHOPNAME } from '../../prisma/generated/prisma/enums'
import { normalizeTextSearch } from '../utils/normalize'
import type { AiProduct } from '../schemas/huntJobSchema'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: { responseMimeType: 'application/json' },
})

export const aiService = {
  visionImageWithAi: async ({
    imageBuffer,
    storeName,
    validFrom,
    validUntil,
    page,
    leafletId,
  }: AiVisionInput): Promise<AiVisionResult> => {
    try {
      const base64Image = imageBuffer.toString('base64')
      const fromStr = validFrom instanceof Date ? validFrom.toISOString().split('T')[0] : String(validFrom)
      const untilStr = validUntil instanceof Date ? validUntil.toISOString().split('T')[0] : String(validUntil)
      let prompt = ''

      if (fromStr && untilStr) {
        prompt = Shop_prompt({
          storeName: storeName as SHOPNAME,
          fromStr: fromStr,
          untilStr: untilStr,
          page: page,
          leafletId: leafletId,
        })
      } else {
        throw new Error(`🥺 Cherio nasiel zle datumy: ${fromStr} az ${untilStr}`)
      }

      const result = await model.generateContent(
        [
          prompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
        { timeout: 300000 },
      )

      const responseText = result.response.text()
      const rawProducts = JSON.parse(responseText)

      // Sanitaze
      const validProducts = rawProducts
        .map((p: any) => {
          const sanitized = aiService.sanitazeRawDataFromAi(p)
          if (sanitized) {
            sanitized.searchName = normalizeTextSearch(sanitized.productName)
          }
          return sanitized
        })
        .filter(Boolean) as AiProduct[]

      return {
        products: validProducts,
        success: true,
      }
    } catch (error: any) {
      const isOverloaded = error.status === 503 || error.status === 429 || error.message?.includes('503')
      if (isOverloaded) {
        return {
          products: [],
          success: false,
          error: `Model nestíha (Chyba ${error.status}). Skús to o chvíľu.`,
        }
      }
      console.error('❌ Chyba v aiService:', error)
      return { products: [], success: false, error: error.message || 'Neznama chyba pri analyze obrazu' }
    }
  },
  sanitazeRawDataFromAi: (product: AiProduct) => {
    const parsePrice = (val: any) => {
      if (!val) return null
      const num = parseFloat(
        String(val)
          .replace(',', '.')
          .replace(/[^0-9.]/g, ''),
      )
      return isNaN(num) ? null : num
    }

    const finalPrice = parsePrice(product.price)
    const originalPrice = parsePrice(product.originalPrice)
    if (!finalPrice || !product.productName) return null

    const cleanedItem: AiProduct = {
      storeName: product.storeName as SHOPNAME,
      leafletId: product.leafletId.toString(),
      productName: String(product.productName).trim(),
      price: finalPrice,
      isAction: true,
      category: product.category || 'N/A',
      cardRequired: product.cardRequired ? Boolean(product.cardRequired) : false,
      validFrom: new Date(product.validFrom),
      validUntil: new Date(product.validUntil),
      page: Number(product.page),
      originalPrice: originalPrice,
      discountPercentage: product.discountPercentage ? String(product.discountPercentage) : null,
      unit: product.unit ? String(product.unit) : null,
      amount: product.amount ? String(product.amount) : null,
      unitPrice: product.unitPrice ? String(product.unitPrice) : null,
      moreInfo: product.moreInfo ? String(product.moreInfo) : null,

      box_2d: Array.isArray(product.box_2d) && product.box_2d.length === 4 ? product.box_2d : null,
      linkToPhoto: null,
    }

    return cleanedItem
  },
  saveToDb: async ({ products }: { products: AiProduct[] }) => {
    if (products.length === 0) return
    const leaflet = products[0]!.leafletId + '-' + products[0]!.storeName
    // console.log(products)
    try {
      const dataToSave = products.map((p) => ({
        ...p,
        searchName: normalizeTextSearch(p.productName),
        box_2d: p.box_2d || undefined,
      }))

      const result = await prisma.productPrice.createManyAndReturn({
        data: dataToSave,
      })
      return result
    } catch (error) {
      prisma.errorNotifier.create({
        data: {
          shopName: products[0]!.storeName as SHOPNAME,
          errorType: 'DBWRITE',
          moreInfo: `${error}`,
          message: `Problem pri ukladani do db ${leaflet}`,
        },
      })
      console.error(`❌ Chyba pri ukladani do db ${leaflet}:`, error)
    }
  },
}

function Shop_prompt({
  storeName,
  leafletId,
  fromStr,
  untilStr,
  page,
}: {
  storeName: SHOPNAME
  leafletId: string
  fromStr: string
  untilStr: string
  page: number
}): string {
  const CATEGORIES_LIST = Object.values(Category)
  return `
   ÚLOHA: Analyzuj leták obchodu ${storeName} a extrahuj dáta o produktoch.
        
    Pre každý relevantný produkt nájdi a zapíš:
    - "productName": Presný názov z letáku (napr. "Pilos Maslo 250g").
    - "price": Aktuálna cena ako číslo (napr. 1.29).
    - "originalPrice": Preškrtnutá cena (ak existuje).
    - "discountPercentage": Ak pise o kolko percent je zlavneny produkt zapis to napriklad: -26% alebo ak vidis staru cenu vypocitaj percentualny rozdiel.
    - "cardRequired": true, ak je cena podmienená vernostnou kartou/aplikáciou (napr. Lidl Plus).
    - "category": Vyber presne jednu kategóriu z tohto zoznamu: [ ${CATEGORIES_LIST} ]. Ak nevieš, použi OSTATNE.
    - "unit": Mnozstvo, napriklad 200 ml alebo 500 g pripadne dlzka,sirka,priemer.
    - "amount": Pocet kusov v baleni.
    - "unitPrice": Cena za jednotku, napriklad 3.48 €/l alebo 5,32 €/100 ml.
    - "moreInfo": Krátka poznámka (napr. "Max. 6ks na osobu" alebo "Pri kúpe 2ks").
    - "validFrom", "validUntil": Použi "${fromStr}" a "${untilStr}", ak v letáku neuvidíš iný špecifický dátum pre daný produkt.
    - "box_2d": [ymin, xmin, ymax, xmax] (0-1000). 
  * TARGET CORE: Zameraj sa na stred produktu obrazku.Orez iba obrazok nic okolo neho! Sustred sa aby okolo obrazka produktu nebol ziadny priestor.


      FIXNÉ HODNOTY (Vždy použi tieto):
    - leafletId: ${leafletId}
    - storeName: ${storeName}
    - page: ${page}
  `
}

// CENTERING: Tvoj box bude slúžiť ako kotva pre stred produktu. Radšej vráť menší a čistý box v strede etikety, než veľký a zubatý box s grafikou letáku.
