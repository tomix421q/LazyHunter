import type { Context } from 'hono'
import { auth } from '../utils/auth'
import { prisma } from '../db/db'
import type { AddToListInput } from '../schemas/schemaList'
import type { ApiResponse } from '../types/types'

export const listsController = {
  addList: async (c: Context) => {
    const { productId, listType } = (await c.req.json()) as AddToListInput

    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session || !session.user) {
      return c.json({ ok: false, message: 'Neautorizovaný prístup. Musíš byť prihlásený.' }, 401)
    }
    const userId = session.user.id

    try {
      const findProduct = await prisma.productPrice.findUnique({
        where: { id: productId },
      })
      if (!findProduct) return c.json({ ok: false, message: 'Produkt nenajdeny' }, 404)

      const createList = await prisma.userList.upsert({
        where: {
          userId_type: {
            userId: userId,
            type: listType,
          },
        },
        update: {},
        create: {
          userId: userId,
          type: listType,
        },
      })

      const findItem = await prisma.userListItem.findFirst({
        where: {
          shoppingListId: createList.id,
          productPriceId: productId,
        },
      })
      console.log(findItem)
      if (findItem) {
        return c.json({ ok: false, message: 'Item exist' }, 409)
      }

      const newItem = await prisma.userListItem.create({
        data: {
          shoppingListId: createList.id,
          productPriceId: productId,
          savedName: findProduct.productName,
          savedPrice: findProduct.price,
          savedStore: findProduct.storeName,
        },
      })

      return c.json({ ok: true, data: newItem }, 201)
    } catch (error) {
      console.error(error)
      return c.json({ ok: false, message: 'Chyba DB' }, 500)
    }
  },
  getLists: async (c: Context) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      return c.json({ ok: false, message: 'Unauthorized' }, 401)
    }
    try {
      const lists = await prisma.userList.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              productPrice: true,
              shoppingList: true,
            },
          },
        },
      })

      const response: ApiResponse<typeof lists> = {
        ok: true,
        data: lists,
      }
      return c.json(response, 200)
    } catch (error) {
      console.error(error)
      return c.json({ ok: false, message: 'Chyba pri nacitani dat' }, 500)
    }
  },
  deleteItemFromList: async (c: Context) => {
    const productId = c.req.param('id')
    console.log(productId)

    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session || !session.user) {
      return c.json({ ok: false, message: 'Neautorizovaný prístup. Musíš byť prihlásený.' }, 401)
    }
    const userId = session.user.id
    console.log(productId)
    try {
      const itemToDelete = await prisma.userListItem.findFirst({
        where: {
          id: productId,
          shoppingList: {
            userId: userId,
          },
        },
      })

      if (!itemToDelete) {
        return c.json({ ok: false, message: 'Produkt nebol nájdený.' }, 404)
      }

      // Delete specific item from the list
      await prisma.userListItem.delete({
        where: {
          id: itemToDelete.id,
        },
      })

      return c.json({ ok: true, message: 'Produkt bol úspešne vymazaný zo zoznamu.' }, 200)
    } catch (error) {
      console.error('Chyba pri mazaní produktu:', error)
      return c.json({ ok: false, message: 'Chyba databázy pri mazaní produktu zo zoznamu.' }, 500)
    }
  },
}
