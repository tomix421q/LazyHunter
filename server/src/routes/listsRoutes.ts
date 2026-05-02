import { listsController } from '../controllers/listsController'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { AddListResponseSchema, addToListSchema, ListSchema } from '../schemas/listSchema'
import { ErrorResponseSchema } from '../schemas/globalSchema'
import { boolean } from 'zod'

export const list_Route = new OpenAPIHono()

export const addListItemRoute = createRoute({
  method: 'post',
  path: '/add',
  request: {
    body: {
      content: {
        'application/json': { schema: addToListSchema },
      },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: AddListResponseSchema } },
      description: 'Položka pridaná do zoznamu',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Neautorizovany',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Produkt nenajdeny',
    },
    409: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Položka už v zozname existuje' },
    500: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Chyba servera' },
  },
})
export const getListsRoute = createRoute({
  method: 'get',
  path: '/all',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean(), data: z.array(z.any()).openapi({ type: 'array', items: { type: 'object' } }) }),
        },
      },
      description: 'Item list uzivatelsky zoznam.',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Neautorizovany uzivatel',
    },
    500: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Chyba servera',
    },
  },
})
export const deleteListRoute = createRoute({
  method: 'delete',
  path: '/remove/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '12333' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ ok: z.literal(true), message: z.string() }) } },
      description: 'Produkt bol úspešne vymazaný zo zoznamu.',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Neautorizovany uzivatel',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Produkt nebol najdeny.',
    },
    500: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Chyba servera pri mazaní produktu zo zoznamu.',
    },
  },
})

list_Route.openapi(addListItemRoute, listsController.addList)
list_Route.openapi(getListsRoute, listsController.getLists)
list_Route.openapi(deleteListRoute, listsController.deleteItemFromList)
