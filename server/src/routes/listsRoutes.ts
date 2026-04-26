import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { listsController } from '../controllers/listsController'
import { addToListSchema } from '../schemas/schemaList'

export const list_Route = new Hono()
  .post('/add', zValidator('json', addToListSchema), listsController.addList)
  .get('/all', listsController.getLists)
  .delete('/remove/:id', listsController.deleteItemFromList)
