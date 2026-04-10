import { Hono } from 'hono'
import { leafletsController } from '../controllers/leafletsController'

const leafletsService_Route = new Hono().get('/availableStores', leafletsController.get_allAvailableShops)

export default leafletsService_Route
