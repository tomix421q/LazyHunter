import { auth } from '../utils/auth'
import { prisma } from '../db/db'
import type { RouteHandler, z } from '@hono/zod-openapi'
import type { addListItemRoute, deleteListRoute, getListsRoute } from '../routes/listsRoutes'

type ListsControllerType = {
  addList: RouteHandler<typeof addListItemRoute>
  getLists: RouteHandler<typeof getListsRoute>
  deleteItemFromList: RouteHandler<typeof deleteListRoute>
}

export const listsController: ListsControllerType = {
  addList: async (c) => {
    const { productId, listType } = c.req.valid('json')

    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session || !session.user) {
      return c.json({ ok: false, error: 'Unauthorized', details: 'Neautorizovaný prístup. Musíš byť prihlásený.' }, 401)
    }
    const userId = session.user.id

    try {
      const findProduct = await prisma.productPrice.findUnique({
        where: { id: productId },
      })
      if (!findProduct) return c.json({ ok: false, error: 'Produkt nenajdeny' }, 404)

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
      if (findItem) {
        return c.json({ ok: false, error: 'Tento item uz v zozname existuje' }, 409)
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
      return c.json({ ok: false, error: 'Chyba DB' }, 500)
    }
  },
  getLists: async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      return c.json({ ok: false, error: 'Unauthorized' }, 401)
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

      return c.json({ ok: true, data: lists }, 200)
    } catch (error) {
      console.error(error)
      return c.json({ ok: false, error: 'Chyba pri nacitani dat' }, 500)
    }
  },
  deleteItemFromList: async (c) => {
    const { id: productId } = c.req.valid('param')

    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session || !session.user) {
      return c.json({ ok: false, error: 'Unauthorized' }, 401)
    }
    const userId = session.user.id

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
        return c.json({ ok: false, error: 'Produkt nebol nájdený.' }, 404)
      }

      // Delete specific item from the list
      await prisma.userListItem.delete({
        where: {
          id: itemToDelete.id,
        },
      })

      return c.json({ ok: true, message: 'Produkt bol úspešne vymazaný zo zoznamu.' }, 200)
    } catch (error) {
      return c.json({ ok: false, error: 'Chyba databázy pri mazaní produktu zo zoznamu.' }, 500)
    }
  },
}
