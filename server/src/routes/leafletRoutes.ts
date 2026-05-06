import { Hono } from 'hono'
import { leafletsController } from '../controllers/leafletsController'

const leafletsService_Route = new Hono()

leafletsService_Route.post('/trigger-hunt', leafletsController.get_leaflet)

export default leafletsService_Route
