import { productsController } from '../controllers/productController'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ProductListResponseSchema, ProductQuerySchema } from '../schemas/productSchemas'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'
import { ErrorResponseSchema } from '../schemas/globalSchema'

const leafletsProducts_Route = new OpenAPIHono()

export const getProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  request: {
    query: ProductQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ProductListResponseSchema } },
      description: 'Success: get products',
    },
    400: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Chyba validácie (vstupných dát)',
    },
    500: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Chyba na strane servera',
    },
  },
})

export const getAvailableStoresRoute = createRoute({
  method: 'get',
  path: '/availablestores',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(z.enum(SHOPNAME)),
        },
      },
      description: 'Success: get available stores',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Server error',
    },
  },
})

leafletsProducts_Route
  .openapi(getProductsRoute, productsController.get_active_products)
  .openapi(getAvailableStoresRoute, productsController.get_allAvailableShops)
// .post('/trigger-hunt', leafletsController.get_leaflet)

export default leafletsProducts_Route
