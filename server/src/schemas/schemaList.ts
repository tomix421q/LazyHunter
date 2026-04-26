import z from 'zod'

export const ListTypeEnum = z.enum(['shoppingList', 'customList', 'aiList'])
export type ListType = z.infer<typeof ListTypeEnum>

export const addToListSchema = z.object({
  productId: z.number().int().positive('ID produktu musi byt kladne cislo.'),
  listType: ListTypeEnum.default('shoppingList'),
})
export type AddToListInput = z.infer<typeof addToListSchema>
