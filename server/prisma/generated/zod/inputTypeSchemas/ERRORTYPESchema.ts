import { z } from 'zod';

export const ERRORTYPESchema = z.enum(['CHEEERIO','GOOGLEMODEL','DBWRITE','ZOD','SHARPCROP','OTHER','DELETEPRICES']);

export type ERRORTYPEType = `${z.infer<typeof ERRORTYPESchema>}`

export default ERRORTYPESchema;
