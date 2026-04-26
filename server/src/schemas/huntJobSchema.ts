import { z } from 'zod'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'

export const AiProductSchema = z.object({
  storeName: z.enum(SHOPNAME),
  leafletId: z.string(),
  productName: z.string(),
  searchName: z.string().optional(),
  price: z.coerce.number(),
  originalPrice: z.coerce.number().nullable().optional(),
  discountPercentage: z.string().nullable().optional(),
  isAction: z.boolean().default(true),
  category: z.string().nullable().optional().default('N/A'),
  cardRequired: z.boolean(),

  unit: z.string().nullable().optional(),
  amount: z.string().nullable().optional(),
  unitPrice: z.string().nullable().optional(),
  moreInfo: z.string().nullable().optional(),

  validFrom: z.date(),
  validUntil: z.date(),
  page: z.number(),
  box_2d: z.array(z.number()).length(4).nullable().optional(),
  linkToPhoto: z.string().nullable().optional(),
})
export type AiProduct = z.infer<typeof AiProductSchema>
