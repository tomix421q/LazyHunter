import { z } from 'zod';

export const SHOPNAMESchema = z.enum(['LIDL','BILLA','COOP','BIEDRONKA','KAUFLAND','TESCO']);

export type SHOPNAMEType = `${z.infer<typeof SHOPNAMESchema>}`

export default SHOPNAMESchema;
