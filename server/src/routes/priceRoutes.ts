import { Hono } from 'hono'

import { leafletsController } from '../controllers/leafletsController'
import { productsController } from '../controllers/productsController'

const leafletsProducts_Route = new Hono()

  .post('/trigger-hunt', leafletsController.get_leaflet)
  .get('/products', productsController.get_active_products)

export default leafletsProducts_Route
