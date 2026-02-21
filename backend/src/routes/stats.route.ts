import { FastifyInstance } from 'fastify'
import { getStatsSummary } from '../services/scan.service'

export async function statsRoutes(app: FastifyInstance) {
  // GET /api/stats/summary
  app.get('/summary', async (_request, reply) => {
    return reply.send(await getStatsSummary())
  })
}
