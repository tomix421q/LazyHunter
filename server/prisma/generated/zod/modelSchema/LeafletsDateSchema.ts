import { z } from 'zod';
import { SHOPNAMESchema } from '../inputTypeSchemas/SHOPNAMESchema'

/////////////////////////////////////////
// LEAFLETS DATE SCHEMA
/////////////////////////////////////////

export const LeafletsDateSchema = z.object({
  shopName: SHOPNAMESchema,
  id: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type LeafletsDate = z.infer<typeof LeafletsDateSchema>

export default LeafletsDateSchema;
