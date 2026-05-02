import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { Decimal as PrismaDecimal } from '../../prisma/internal/prismaNamespace';
import { SHOPNAMESchema } from '../inputTypeSchemas/SHOPNAMESchema'

/////////////////////////////////////////
// PRODUCT PRICE SCHEMA
/////////////////////////////////////////

export const ProductPriceSchema = z.object({
  storeName: SHOPNAMESchema,
  id: z.number().int(),
  leafletId: z.string(),
  productName: z.string(),
  searchName: z.string(),
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'ProductPrice']"}),
  originalPrice: z.instanceof(PrismaDecimal, { message: "Field 'originalPrice' must be a Decimal. Location: ['Models', 'ProductPrice']"}).nullable(),
  isAction: z.boolean(),
  cardRequired: z.boolean(),
  discountPercentage: z.string().nullable(),
  category: z.string().nullable(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  page: z.number().int(),
  unit: z.string().nullable(),
  amount: z.string().nullable(),
  unitPrice: z.string().nullable(),
  box_2d: JsonValueSchema.nullable(),
  linkToPhoto: z.string().nullable(),
  linkToAction: z.string().nullable(),
  moreInfo: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type ProductPrice = z.infer<typeof ProductPriceSchema>

export default ProductPriceSchema;
