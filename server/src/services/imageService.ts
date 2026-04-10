import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { prisma } from '../db/db'
import type { SHOPNAME } from '../../prisma/generated/prisma/enums'

export const imageService = {
  cropProductImage: async ({
    shopName,
    imageBuffer,
    box2d,
    productName,
    productId,
  }: {
    shopName: SHOPNAME
    imageBuffer: Buffer
    box2d: number[]
    productName: string
    productId: string
  }): Promise<string | null> => {
    try {
      const image = sharp(imageBuffer)
      const metadata = await image.metadata()

      const imgWidth = metadata.width
      const imgHeight = metadata.height

      if (!imgWidth || !imgHeight || box2d.length !== 4) return null

      const [ymin, xmin, ymax, xmax] = box2d
      const boxWidth = xmax! - xmin!
      const boxHeight = ymax! - ymin!
      const padding = 0.05

      const newXmin = Math.max(0, xmin! - boxWidth * padding)
      const newXmax = Math.min(1000, xmax! + boxWidth * padding)
      const newYmin = Math.max(0, ymin! - boxHeight * padding)
      const newYmax = Math.min(1000, ymax! + boxHeight * padding)

      let left = Math.round((newXmin / 1000) * imgWidth)
      let top = Math.round((newYmin / 1000) * imgHeight)
      let width = Math.round(((newXmax - newXmin) / 1000) * imgWidth)
      let height = Math.round(((newYmax - newYmin) / 1000) * imgHeight)

      left = Math.max(0, left)
      top = Math.max(0, top)
      if (left + width > imgWidth) width = imgWidth - left
      if (top + height > imgHeight) height = imgHeight - top
      if (width <= 0 || height <= 0) return null

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      await fs.mkdir(uploadDir, { recursive: true })

      const safeName = productName
        .normalize('NFC')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
      const fileName = `${productId}-${safeName}.jpg`
      const filePath = path.join(uploadDir, fileName)

      await image
        .extract({ left, top, width, height })
        .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filePath)

      return `/uploads/products/${fileName}`
    } catch (error) {
      await prisma.errorNotifier.create({
        data: {
          shopName: shopName,
          errorType: 'SHARPCROP',
          message: `Problem v rezani alebo v ulozeni obrazku v imageService.`,
          moreInfo: `${error}`,
        },
      })
      console.error(`❌ Chyba pri rezani obrazka pre ${shopName}-${productName}:`, error)
      return null
    }
  },
}
