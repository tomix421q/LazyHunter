import { z } from 'zod';

/////////////////////////////////////////
// USER LIST SCHEMA
/////////////////////////////////////////

export const UserListSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  type: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserList = z.infer<typeof UserListSchema>

export default UserListSchema;
