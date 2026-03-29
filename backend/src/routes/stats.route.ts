import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth.middleware'
import { getStatsSummary } from '../services/scan.service'

export async function statsRoutes(app: FastifyInstance) {
  // GET /api/stats/summary - Require admin or officer role
  app.get('/summary', { preHandler: authenticate(['admin', 'officer']) }, async (_request, reply) => {
    return reply.send(await getStatsSummary())
  })
}
