import pMap from 'p-map'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'
import { prisma } from '../db/db'
import { aiService } from '../services/aiService'
import { cheerioService } from '../services/cheerioService'
import { imageService } from '../services/imageService'
import { AiProductSchema, type AiProduct } from '../types/types'

export async function runHuntJob(shopName: SHOPNAME) {
  let scraperResult
  let savedPages = 0
  let savedProducts = 0

  switch (shopName) {
    case SHOPNAME.LIDL:
      scraperResult = await cheerioService.getImages('https://lidl.akcneletaky.sk/', 'https://img.akcneletaky.sk/lidl/letak')
      break
    case SHOPNAME.BILLA:
      scraperResult = await cheerioService.getImages('https://billa.akcneletaky.sk/', 'https://img.akcneletaky.sk/billa/letak')
      break
    case SHOPNAME.BIEDRONKA:
      scraperResult = await cheerioService.getImages(
        'https://biedronka.akcneletaky.sk/',
        'https://img.akcneletaky.sk/biedronka/letak',
      )
      break
    case SHOPNAME.COOP:
      scraperResult = await cheerioService.getImages('https://coop.akcneletaky.sk/', 'https://img.akcneletaky.sk/coop/letak')
      break
    case SHOPNAME.KAUFLAND:
      scraperResult = await cheerioService.getImages(
        'https://kaufland.akcneletaky.sk/',
        'https://img.akcneletaky.sk/kaufland/letak',
      )
      break
    case SHOPNAME.TESCO:
      scraperResult = await cheerioService.getImages('https://tesco.akcneletaky.sk/', 'https://img.akcneletaky.sk/tesco/letak')
      break
    default:
      console.error(`❌ Neznamy obchod: ${shopName}`)
      return
  }

  //
  // CHEERIO
  if (scraperResult.ok) {
    const existingLeaflet = await prisma.leafletsDate.findFirst({
      where: {
        shopName: shopName,
        validFrom: scraperResult.validFrom,
        validUntil: scraperResult.validUntil,
      },
    })
    if (existingLeaflet) {
      console.log(
        `Letak pre ${shopName} (${scraperResult.validFrom.toISOString().split('T')[0]} - ${scraperResult.validUntil.toISOString().split('T')[0]}) uz mame. Preskakujem lov!`,
      )
      return
    }
    if (!scraperResult.imagesUrl) {
      await prisma.errorNotifier.create({
        data: {
          shopName: shopName,
          errorType: 'CHEEERIO',
          message: `❌ Cheerio nenaslo ziadne obrazky produktov pre ${shopName}`,
        },
      })
      console.log(`❌ Cheerio nenaslo ziadne obrazky produktov. Koncim job`)
      return
    }
  } else {
    await prisma.errorNotifier.create({
      data: {
        shopName: shopName,
        errorType: 'CHEEERIO',
        message: `❌ Problem s fetchom stranky letaku pre obchod: ${shopName}`,
        moreInfo: scraperResult.error as string,
      },
    })
    console.log(`Problem s fetchom stranky letaku pre obchod: ${shopName}`)
    return
  }

  //
  // Fetch single page + OCR page with AI + ZOD validation this products + image crop single product
  const processSinglePage = async (imgUrl: string, index: number) => {
    const pageNumber = index + 1
    console.log(`Pripravujem stranu ${pageNumber} `)

    let pageBuffer: Buffer
    try {
      const response = await fetch(imgUrl, {
        tls: { rejectUnauthorized: false },
      } as any)
      if (!response.ok) throw new Error(`Chyba stahovanie stranky: ${response.status}`)
      const arrayBuffer = await response.arrayBuffer()
      pageBuffer = Buffer.from(arrayBuffer)
    } catch (err) {
      console.log(`Nepodarilo sa tiahnut stranu ${pageNumber}:`, err)
      return
    }

    const MAX_RETRIES = 3
    let productsResult = null
    let isSuccess = false
    let lastError = null

    // Retry LOOP - take products from page with AI
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { products, success, error } = await aiService.visionImageWithAi({
          imageBuffer: pageBuffer,
          storeName: shopName as SHOPNAME,
          leafletId: scraperResult.leafletId,
          validFrom: scraperResult.validFrom,
          validUntil: scraperResult.validUntil,
          page: pageNumber,
        })
        if (success) {
          productsResult = products
          isSuccess = true
          break
        } else {
          lastError = error
          console.warn(`Pokus ${attempt}/${MAX_RETRIES} pre stranu ${pageNumber}`)
        }
      } catch (err) {
        lastError = err
        console.warn(`Pokus ${attempt}/${MAX_RETRIES} pre stranu ${pageNumber}`)
      }
      if (attempt < MAX_RETRIES && !isSuccess) {
        const delay = attempt * 5000
        console.log(`Cakam ${delay / 1000} sekund pred dalsim pokusom pre stranu ${pageNumber} vyhodil vynimku!`)
        await new Promise((r) => setTimeout(r, delay))
      }
    }

    // --- IF google model crash after 3x ---
    if (!isSuccess || !productsResult) {
      await prisma.errorNotifier.create({
        data: {
          shopName,
          errorType: 'GOOGLEMODEL',
          message: `Problem s AI modelom na strane ${pageNumber} ani po ${MAX_RETRIES} pokusoch.`,
          moreInfo: `${lastError}`,
        },
      })
      console.error(`❌ Definitívne zlyhanie AI na strane ${pageNumber}`)
      return
    }

    // IF google model success
    // Zod validation
    const validProductsToSave: AiProduct[] = []

    for (const itemProduct of productsResult) {
      const validate = AiProductSchema.safeParse(itemProduct)
      if (!validate.success) {
        await prisma.errorNotifier.create({
          data: {
            shopName: shopName,
            errorType: 'ZOD',
            message: `Zod chybna validacia pre produkt: ${itemProduct || 'N/A'}`,
            moreInfo: `${validate.error.message}`,
          },
        })
        console.log(`Product nepresiel Zod validaciou`, validate.error)
        continue
      }
      validProductsToSave.push(itemProduct)
    }

    //
    // DB Logic
    if (validProductsToSave.length === 0) return
    const saveToDb = await aiService.saveToDb({ products: validProductsToSave })
    if (!saveToDb) return
    savedPages += 1
    savedProducts += saveToDb.length

    //
    // Image crop - Paralel
    const cropPromises = saveToDb.map(async (product) => {
      const pictureProductLink = await imageService.cropProductImage({
        shopName: shopName,
        imageBuffer: pageBuffer,
        box2d: product.box_2d as number[],
        productName: product.storeName as SHOPNAME,
        productId: product.id.toString(),
      })
      if (pictureProductLink) {
        await prisma.productPrice.update({
          where: {
            id: product.id,
          },
          data: {
            linkToPhoto: pictureProductLink,
          },
        })
      }
    })

    await Promise.all(cropPromises)
    await new Promise((r) => setTimeout(r, 2000))
    console.log(`Strana ${pageNumber} spracovana`)
  }

  await pMap(scraperResult.imagesUrl, processSinglePage, { concurrency: 5 })

  await prisma.leafletsDate.create({
    data: {
      shopName: shopName,
      validFrom: scraperResult.validFrom,
      validUntil: scraperResult.validUntil,
    },
  })
  console.log(
    `✅ Hotovo!, pre ${shopName}. Datum letaku: ${JSON.stringify(scraperResult.validFrom)}-${JSON.stringify(scraperResult.validUntil)}. Pocet stran ${scraperResult.imagesUrl.length}`,
  )
  return {
    ok: true,
    savedPages: savedPages,
    savedProducts: savedProducts,
    dates: { validFrom: scraperResult.validFrom, validUntil: scraperResult.validUntil },
  }
}
