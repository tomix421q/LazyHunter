import { z } from 'zod';

export const UserListScalarFieldEnumSchema = z.enum(['id','userId','type','createdAt','updatedAt']);

export default UserListScalarFieldEnumSchema;
