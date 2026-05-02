import { z } from 'zod';
import { ERRORTYPESchema } from '../inputTypeSchemas/ERRORTYPESchema'
import { SHOPNAMESchema } from '../inputTypeSchemas/SHOPNAMESchema'

/////////////////////////////////////////
// ERROR NOTIFIER SCHEMA
/////////////////////////////////////////

export const ErrorNotifierSchema = z.object({
  errorType: ERRORTYPESchema,
  shopName: SHOPNAMESchema.nullable(),
  id: z.number().int(),
  message: z.string(),
  moreInfo: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type ErrorNotifier = z.infer<typeof ErrorNotifierSchema>

export default ErrorNotifierSchema;
