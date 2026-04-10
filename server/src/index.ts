import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import leafletsProducts_Route from './routes/priceRoutes'
import { Hono, type Context } from 'hono'
import { serveStatic } from 'hono/bun'
import leafletsService_Route from './routes/leafletRoutes'
import { auth } from './utils/auth.ts'

const app = new Hono()

//! Middleware
app.use(
  '*',
  logger((str) => {
    if (str.includes('/uploads/')) return
    console.log(str)
  }),
)
app.use('/uploads/*', serveStatic({ root: './public', rewriteRequestPath: (path) => path }))
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

//! Workers init
import './jobs/workers/index.ts'

// !Temp
// seedDatabase()

// !Api Routes
const routes = app
  .get('/', (c: Context) => {
    return c.text('Hello from LazyHunter API.')
  })
  .route('/api', leafletsProducts_Route)
  .route('/api', leafletsService_Route)

export type AppType = typeof routes

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
  idleTimeout: 255,
}
