import { z } from 'zod';

export const ErrorNotifierScalarFieldEnumSchema = z.enum(['id','errorType','shopName','message','moreInfo','createdAt']);

export default ErrorNotifierScalarFieldEnumSchema;
