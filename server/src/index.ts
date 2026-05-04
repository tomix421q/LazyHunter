import { Scalar } from '@scalar/hono-api-reference'
import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import leafletsProducts_Route from './routes/productRoutes.ts'
import { list_Route } from './routes/listsRoutes.ts'
import { serveStatic } from 'hono/bun'
import leafletsService_Route from './routes/leafletRoutes'
import { auth } from './utils/auth.ts'

const app = new OpenAPIHono()

//! Middleware
app.use(
  '*',
  logger((str) => {
    if (str.includes('/uploads/')) return
    if (str.includes('/api/auth/get-session')) return
    console.log(new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), str)
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
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Moje Shopping API',
  },
})

//! Workers init
import './jobs/workers/index.ts'

// !Temp
// seedDatabase()

// !Api Routes
const routes = app
  .get('/', (c) => {
    return c.text('Hello from LazyHunter API.')
  })
  .route('/api', leafletsProducts_Route)
  .route('/api', leafletsService_Route)
  .route('/api/list', list_Route)
  .get('/scalar', Scalar({ url: '/doc' }) as any)

export type AppType = typeof routes
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
  idleTimeout: 255,
}
