import { z } from 'zod';

export const UserListItemScalarFieldEnumSchema = z.enum(['id','shoppingListId','productPriceId','savedName','savedPrice','savedStore','isCompleted','createdAt']);

export default UserListItemScalarFieldEnumSchema;
