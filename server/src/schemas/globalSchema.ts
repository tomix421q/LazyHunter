import { z } from '@hono/zod-openapi'

export const ErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    details: z.any().optional().openapi({ example: 'Pole "page" musí byť číslo' }),
  })
  .openapi('ErrorResponse')
