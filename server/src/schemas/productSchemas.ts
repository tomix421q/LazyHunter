import { z } from '@hono/zod-openapi'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'

export const ProductQuerySchema = z.object({
  page: z.string().optional().transform(Number).default(1),
  limit: z.string().optional().transform(Number).default(51),
  search: z.string().optional(),
  store: z.enum(SHOPNAME).optional(),
})

//
// RESPONSES
const PaginationMetaSchema = z
  .object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })
  .openapi('PaginationMeta')

export const ProductSchema = z
  .object({
    id: z.number(),
    leafletId: z.string(),
    productName: z.string(),
    searchName: z.string(),
    price: z.string(),
    originalPrice: z.string().nullable(),
    storeName: z.enum(SHOPNAME),
    isAction: z.boolean(),
    cardRequired: z.boolean(),
    discountPercentage: z.string().nullable(),
    category: z.string().nullable(),
    validFrom: z
      .date()
      .or(z.string())
      .transform((v) => (v instanceof Date ? v.toISOString() : v)),
    validUntil: z
      .date()
      .or(z.string())
      .transform((v) => (v instanceof Date ? v.toISOString() : v)),
    unit: z.string().nullable(),
    amount: z.string().nullable(),
    unitPrice: z.string().nullable(),
    page: z.number(),
    box_2d: z.any().nullable(),
    linkToPhoto: z.string().nullable(),
    linkToAction: z.string().nullable(),
    moreInfo: z.string().nullable(),
    createdAt: z
      .date()
      .or(z.string())
      .transform((v) => (v instanceof Date ? v.toISOString() : v)),
  })
  .openapi('Product')

export const ProductListResponseSchema = z
  .object({
    ok: z.boolean(),
    data: z.array(ProductSchema),
    meta: PaginationMetaSchema,
  })
  .openapi('ProductListResponse')

//
// ERRROR RESPONSE
