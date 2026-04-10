export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

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
