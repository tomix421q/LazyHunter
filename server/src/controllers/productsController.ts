import { type ApiResponse } from './../types/typesProduct'
import type { Context } from 'hono'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'
import type { ProductPriceWhereInput } from '../../prisma/generated/prisma/models'
import { prisma } from '../db/db'
import { type ProductPrice } from '../../prisma/generated/prisma/client'
import { handleError } from '../utils'
import { normalizeTextSearch } from '../utils/normalize'

export const productsController = {
  get_active_products: async (c: Context) => {
    try {
      const page = Number(c.req.query('page')) || 1
      const search = c.req.query('search')
      const limit = Number(c.req.query('limit')) || 51
      const storeParam = c.req.query('store')

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

      //if user shop include any SHOPNAME value
      if (storeParam) {
        if (Object.values(SHOPNAME).includes(storeParam as SHOPNAME)) {
          whereParam.storeName = storeParam as SHOPNAME
        } else {
          const errorResponse: ApiResponse<null> = {
            ok: false,
            error: `Neznamy obchod ${storeParam}. Povolene su: ${Object.values(SHOPNAME).join(', ')}`,
          }
          return c.json(errorResponse, 400)
        }
      }

      //get database promise
      const [products, totalCount] = await Promise.all([
        prisma.productPrice.findMany({
          where: whereParam,
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.productPrice.count({ where: whereParam }),
      ])

      // console.log(products)
      const successResponse: ApiResponse<ProductPrice[]> = {
        ok: true,
        data: products,
        meta: {
          total: totalCount,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      }

      return c.json(successResponse, 200)
    } catch (error: unknown) {
      return handleError(error, c)
    }
  },
}
