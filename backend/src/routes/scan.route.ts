import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth.middleware'
import { ScanInputSchema, ScanQuerySchema, ScanStatsQuerySchema } from '../schemas/scan.schema'
import * as scanService from '../services/scan.service'

export async function scanRoutes(app: FastifyInstance) {
  // POST /api/scans
  app.post('/', async (request, reply) => {
    const body = ScanInputSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }
    const result = await scanService.createScan(body.data, request.user?.userId)
    if (!result) {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Barcode tidak ditemukan' })
    }
    return reply.status(201).send(result)
  })

  // GET /api/scans
  app.get('/', { preHandler: authenticate(['admin', 'officer']) }, async (request, reply) => {
    const query = ScanQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: query.error.errors[0].message })
    }
    return reply.send(await scanService.getScans(query.data))
  })

  // GET /api/scans/stats
  app.get('/stats', { preHandler: authenticate(['admin', 'officer']) }, async (request, reply) => {
    const query = ScanStatsQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: query.error.errors[0].message })
    }
    return reply.send(await scanService.getScanStats(query.data.period))
  })
}
