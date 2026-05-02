import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../../prisma/internal/prismaNamespace';
import { SHOPNAMESchema } from '../inputTypeSchemas/SHOPNAMESchema'

/////////////////////////////////////////
// USER LIST ITEM SCHEMA
/////////////////////////////////////////

export const UserListItemSchema = z.object({
  savedStore: SHOPNAMESchema,
  id: z.uuid(),
  shoppingListId: z.string(),
  productPriceId: z.number().int().nullable(),
  savedName: z.string(),
  savedPrice: z.instanceof(PrismaDecimal, { message: "Field 'savedPrice' must be a Decimal. Location: ['Models', 'UserListItem']"}),
  isCompleted: z.boolean(),
  createdAt: z.coerce.date(),
})

export type UserListItem = z.infer<typeof UserListItemSchema>

export default UserListItemSchema;
