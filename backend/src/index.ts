import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import path from 'path'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

import { authRoutes, userRoutes } from './routes/auth.route'
import { plantRoutes } from './routes/plant.route'
import { categoryRoutes } from './routes/category.route'
import { scanRoutes } from './routes/scan.route'
import { uploadRoutes } from './routes/upload.route'
import { statsRoutes } from './routes/stats.route'

const app = Fastify({ logger: true })

async function build() {
  // Security & CORS
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:8080',
    credentials: true,
  })

  // Multipart (file upload)
  await app.register(multipart, {
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE ?? 5242880) },
  })

  // Serve uploaded files
  const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads')
  await app.register(staticFiles, { root: uploadDir, prefix: '/uploads/' })

  // Swagger (load dari openapi.yaml)
  const openapiPath = path.resolve(__dirname, '../../docs/openapi.yaml')
  const openapiSpec = parse(readFileSync(openapiPath, 'utf-8'))

  await app.register(swagger, { specification: { document: openapiSpec } })
  await app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
    staticCSP: true,
  })

  // Routes
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(userRoutes, { prefix: '/api/users' })
  await app.register(plantRoutes, { prefix: '/api/plants' })
  await app.register(categoryRoutes, { prefix: '/api/categories' })
  await app.register(scanRoutes, { prefix: '/api/scans' })
  await app.register(uploadRoutes, { prefix: '/api/upload' })
  await app.register(statsRoutes, { prefix: '/api/stats' })

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}

build().then(async (server) => {
  const port = Number(process.env.PORT ?? 3000)
  await server.listen({ port, host: '0.0.0.0' })
  console.log(`\n🌿 Flora Depok API berjalan di http://localhost:${port}`)
  console.log(`📄 Swagger UI: http://localhost:${port}/api/docs\n`)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
