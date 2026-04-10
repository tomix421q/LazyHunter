import path from 'path'
import { unlink } from 'fs/promises'
import { prisma } from '../../db/db'

export async function cleanupOldProducts() {
  try {
    const now = new Date()
    const oldProducts = await prisma.productPrice.findMany({
      where: { validUntil: { lte: now } },
      select: { id: true, storeName: true, linkToPhoto: true },
    })

    if (oldProducts.length === 0) {
      console.log('✨ [Cleanup] Žiadne expirované produkty.')
      return
    }
    for (const product of oldProducts) {
      if (product.linkToPhoto) {
        await deleteProductImage(product)
      }
    }

    const { count } = await prisma.productPrice.deleteMany({
      where: { id: { in: oldProducts.map((p) => p.id) } },
    })

    console.log(`🗑️ [Cleanup] Úspešne odstránených ${count} záznamov.`)
  } catch (err) {
    console.error('🔥 [Cleanup] Fatálna chyba pri čistení:', err)
  }
}

async function deleteProductImage(product: { id: number; storeName: any; linkToPhoto: string | null }) {
  try {
    const relativePath = product.linkToPhoto!.startsWith('/') ? product.linkToPhoto!.substring(1) : product.linkToPhoto!

    const filePath = path.join(process.cwd(), 'public', relativePath)

    await unlink(filePath)
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ [Cleanup] Súbor ${product.id} nebolo možné zmazať:`, err.message)
      await prisma.errorNotifier.create({
        data: {
          shopName: product.storeName,
          errorType: 'DELETEPRICES',
          message: `Chyba pri mazaní FS súboru: ${product.id}`,
          moreInfo: String(err),
        },
      })
    }
  }
}
