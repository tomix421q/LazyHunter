import { z } from '@hono/zod-openapi'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'
import { ProductSchema } from './productSchemas'
import { ProductPriceSchema, UserListSchema } from '../../prisma/generated/zod'

export const ListTypeEnum = z.enum(['shoppingList', 'customList', 'aiList'])

export const addToListSchema = z.object({
  productId: z.number().int().positive('ID produktu musi byt kladne cislo.').openapi({ example: 123 }),
  listType: ListTypeEnum.default('shoppingList').openapi({ example: 'shoppingList' }),
})

export const UserListItemSchema = z
  .object({
    id: z.string(),
    savedName: z.string(),
    savedPrice: z.coerce.string().openapi({ type: 'number', example: 10.99 }),
    savedStore: z.enum(SHOPNAME),
    isCompleted: z.boolean(),
    createdAt: z.coerce.date().openapi({ type: 'string', format: 'date-time' }),
    shoppingListId: z.string(),
    productPriceId: z.number().nullable(),
    productPrice: z.coerce.number().optional(),
    shoppingList: z.coerce.number().optional(),
  })
  .openapi('UserListItem')

export const AddListResponseSchema = z
  .object({
    ok: z.boolean(),
    data: UserListItemSchema.optional(),
    message: z.string().optional(),
  })
  .openapi('AddListResponse')

const ListItemWithRelationsSchema = z.object({
  id: z.string(),
  productPrice: ProductSchema.nullable(),
  shoppingList: z.object({
    id: z.string(),
    type: z.string(),
  }),
})

export const UserListWithItemsSchema = z.object({
  id: z.string(),
  type: z.string(),
  items: z.array(ListItemWithRelationsSchema),
})

export const GetListsResponseSchema = z.object({
  ok: z.boolean(),
  data: z.array(UserListWithItemsSchema), // Očakávame POLE listov
})

export const ListItemSchema = UserListItemSchema.extend({
  productPrice: ProductPriceSchema,
  shoppingList: UserListItemSchema,
})

export const ListSchema = UserListSchema.extend({
  items: z.array(ListItemSchema).nullable(),
})

export type ListType = z.infer<typeof ListTypeEnum>
export type AddToListInput = z.infer<typeof addToListSchema>
