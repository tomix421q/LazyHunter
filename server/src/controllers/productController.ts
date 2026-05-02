import type { ProductPriceWhereInput } from '../../prisma/generated/prisma/models'
import { prisma } from '../db/db'
import { normalizeTextSearch } from '../utils/normalize'
import type { RouteHandler } from '@hono/zod-openapi'
import type { getAvailableStoresRoute, getProductsRoute } from '../routes/productRoutes'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'

type ProductsControllerType = {
  get_active_products: RouteHandler<typeof getProductsRoute>
  get_allAvailableShops: RouteHandler<typeof getAvailableStoresRoute>
}

export const productsController: ProductsControllerType = {
  get_active_products: async (c) => {
    try {
      const { page, limit, search, store } = c.req.valid('query')
      const skip = (page - 1) * limit
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      const whereParam: ProductPriceWhereInput = {
        validUntil: {
          gte: now,
        },
      }
      if (search && search.length > 0) {
        const cleanSearch = normalizeTextSearch(search)
        whereParam.searchName = {
          contains: cleanSearch,
          mode: 'insensitive',
        }
      }
      if (store !== undefined) {
        whereParam.storeName = store
      }

      //get database promise
      const [products, totalCount] = await Promise.all([
        prisma.productPrice.findMany({
          where: whereParam,
          skip: skip,
          take: limit,
          orderBy: {
            page: 'asc',
          },
        }),
        prisma.productPrice.count({ where: whereParam }),
      ])

      return c.json(
        {
          ok: true,
          data: products,
          meta: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        200,
      )
    } catch (error: unknown) {
      return c.json(
        {
          ok: false,
          error: 'Chyba servera',
          details: error,
        },
        500,
      )
    }
  },
  get_allAvailableShops: async (c) => {
    try {
      const getAvailableShops = Object.values(SHOPNAME)
      return c.json(getAvailableShops, 200)
    } catch (error: unknown) {
      return c.json({ ok: false, error: 'Nepodarilo sa nacitat obchody' }, 500)
    }
  },
}
