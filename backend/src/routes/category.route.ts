import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function categoryRoutes(app: FastifyInstance) {
  // GET /api/categories
  app.get('/', async (_request, reply) => {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { plants: true } } },
      orderBy: { name: 'asc' },
    })

    return reply.send(
      categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat._count.plants,
      }))
    )
  })
}
