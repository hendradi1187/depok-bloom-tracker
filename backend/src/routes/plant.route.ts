import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth.middleware'
import { PlantInputSchema, PlantQuerySchema } from '../schemas/plant.schema'
import * as plantService from '../services/plant.service'

export async function plantRoutes(app: FastifyInstance) {
  // GET /api/plants
  app.get('/', async (request, reply) => {
    const query = PlantQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: query.error.errors[0].message })
    }
    return reply.send(await plantService.getPlants(query.data))
  })

  // GET /api/plants/barcode/:barcode  ← harus sebelum /:id
  app.get('/barcode/:barcode', async (request, reply) => {
    const { barcode } = request.params as { barcode: string }
    const plant = await plantService.getPlantByBarcode(barcode)
    if (!plant) {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Barcode tidak ditemukan' })
    }
    return reply.send(plant)
  })

  // GET /api/plants/:id
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const plant = await plantService.getPlantById(id)
    if (!plant) {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Tanaman tidak ditemukan' })
    }
    return reply.send(plant)
  })

  // POST /api/plants
  app.post('/', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const body = PlantInputSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }
    try {
      const plant = await plantService.createPlant(body.data)
      return reply.status(201).send(plant)
    } catch {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Barcode sudah digunakan' })
    }
  })

  // PUT /api/plants/:id
  app.put('/:id', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = PlantInputSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }
    try {
      return reply.send(await plantService.updatePlant(id, body.data))
    } catch {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Tanaman tidak ditemukan' })
    }
  })

  // DELETE /api/plants/:id
  app.delete('/:id', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      await plantService.deletePlant(id)
      return reply.status(204).send()
    } catch {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Tanaman tidak ditemukan' })
    }
  })
}
