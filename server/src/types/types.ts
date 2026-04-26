import { SHOPNAME } from '../../prisma/generated/prisma/enums'
import type { AiProduct } from '../schemas/huntJobSchema'

export type ApiResponse<T = null> =
  | {
      ok: true
      data: T
      meta?: PaginationMeta
    }
  | {
      ok: false
      error: string
      details?: any
    }

export type DateContext = {
  validFrom: Date | null
  validUntil: Date | null
}

export type AiVisionInput = {
  imageBuffer: Buffer
  storeName: SHOPNAME
  leafletId: string
  validFrom: Date | null
  validUntil: Date | null
  page: number
}

export type AiVisionResult = {
  products: AiProduct[]
  success: boolean
  error?: Error | string
}

export type CheerioResult =
  | {
      ok: true
      imagesUrl: string[] | []
      validFrom: Date
      validUntil: Date
      leafletId: string
    }
  | {
      ok: false
      error: Error | string
    }

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}
