import type { Context } from 'hono'

import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { ApiResponse } from '../types/typesProduct'
import { Prisma } from '../../prisma/generated/prisma/client'

export function handleError(error: unknown, c: Context) {
  console.error('❌ Zachytená chyba na backende:', error)

  let errorResponse: ApiResponse<null> = {
    ok: false,
    error: 'Nastala neznáma chyba pri komunikácii so serverom.',
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    errorResponse.error = 'Neplatné dáta. Skontroluj, či posielaš správny formát.'
    return c.json(errorResponse, 400)
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError
    let statusCode: ContentfulStatusCode = 400
    let userFriendlyMessage = 'Dáta sa nepodarilo spracovať.'

    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409
        userFriendlyMessage = 'Tento záznam už v systéme existuje (duplikát). Skús zadať iný údaj.'
        break
      case 'P2025':
        statusCode = 404 // 404 Not Found
        userFriendlyMessage = 'Záznam, ktorý sa snažíš upraviť alebo vymazať, sa nenašiel.'
        break
      case 'P2003':
        statusCode = 409 // 409 Conflict
        userFriendlyMessage = 'Tento záznam nemôžeš vymazať, pretože sú naň napojené iné dáta (napr. kategória s produktami).'
        break
      case 'P2000':
        statusCode = 400 // 400 Bad Request
        userFriendlyMessage = 'Zadaný text je príliš dlhý pre databázu.'
        break
    }

    errorResponse.error = userFriendlyMessage
    errorResponse.details = `Prisma kód: ${prismaError.code}`
    return c.json(errorResponse, statusCode)
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    errorResponse.error = 'Databáza je momentálne nedostupná. Skús to prosím neskôr.'
    return c.json(errorResponse, 503)
  } else {
    const errorMessage = error instanceof Error ? error.message : 'Neznáma systémová chyba'
    errorResponse.error = 'Nepodarilo sa vykonať požiadavku.'
    errorResponse.details = errorMessage
    return c.json(errorResponse, 500)
  }
}
