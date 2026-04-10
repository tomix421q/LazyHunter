import * as cheerio from 'cheerio'
import type { CheerioResult } from '../types/types'

export const cheerioService = {
  getImages: async (url: string, urlImgs: string): Promise<CheerioResult> => {
    let validFrom: Date
    let validUntil: Date
    const imageUrls = []

    try {
      const response = await fetch(url)
      const html = await response.text()
      const $ = cheerio.load(html)

      const linkElement = $('a[href*="/letaksh/"]').first()
      const href = linkElement.attr('href')
      if (!href) {
        throw new Error('❌ Nenasiel som odkaz na letak (nejaka zmena url?)')
      }
      const match = href.match(/\/letaksh\/(\d+)\//)
      if (!match || !match[1]) {
        throw new Error(`❌ Neviem vyparsovat ID z linku: ${href}`)
      }

      const leafletId = match[1]

      // Find number of pages imgs
      let totalPages = 10
      const matchPages = html.match(/viewSmall\s*\(\s*\d+\s*,\s*(\d+)/)
      if (matchPages && matchPages[1]) {
        totalPages = parseInt(matchPages[1], 10)
      }

      for (let i = 1; i <= totalPages; i++) {
        imageUrls.push(`${urlImgs}${leafletId}/strana${i}.jpg`)
      }

      const timeElement = $('time[itemprop="validFrom validThrough"]').first()
      const datetimeAttr = timeElement.attr('datetime')

      if (datetimeAttr && datetimeAttr.includes('/')) {
        const [fromStr, untilStr] = datetimeAttr.split('/')
        if (fromStr && untilStr) {
          validFrom = new Date(fromStr)
          validUntil = new Date(untilStr)
          console.log(`✅ Úspešne vyparsované dátumy cez Cheerio: ${fromStr} až ${untilStr}`)

          return {
            ok: true,
            imagesUrl: imageUrls,
            validFrom: validFrom,
            validUntil: validUntil,
            leafletId: leafletId,
          }
        }
      }
      return { ok: false, error: '❌ Chyba pri parsovani datumu letaku' }
    } catch (error) {
      console.error('🙉 Chyba pri fetchovani letaku', error)
      return { ok: false, error: error as Error }
    }
  },
}
