import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth.middleware'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export async function uploadRoutes(app: FastifyInstance) {
  // POST /api/upload/plant-image
  app.post('/plant-image', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'File tidak ditemukan' })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'File harus berformat JPG, PNG, atau WEBP',
      })
    }

    const ext = path.extname(data.filename) || '.jpg'
    const filename = `${randomUUID()}${ext}`
    const uploadDir = process.env.UPLOAD_DIR ?? './uploads'
    const filepath = path.join(uploadDir, filename)

    await fs.mkdir(uploadDir, { recursive: true })

    const buffer = await data.toBuffer()

    const maxSize = Number(process.env.MAX_FILE_SIZE ?? 5242880)
    if (buffer.length > maxSize) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Ukuran file maksimal 5MB',
      })
    }

    await fs.writeFile(filepath, buffer)

    const baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    const url = `${baseUrl}/uploads/${filename}`

    return reply.send({ url, filename })
  })
}
