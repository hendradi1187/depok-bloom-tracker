import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth.middleware'
import { LoginSchema, UserInputSchema, UserUpdateSchema } from '../schemas/auth.schema'
import * as authService from '../services/auth.service'

export async function authRoutes(app: FastifyInstance) {
  // POST /api/auth/login
  app.post('/login', async (request, reply) => {
    const body = LoginSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }

    const result = await authService.login(body.data)
    if (!result) {
      return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Email atau password salah' })
    }

    return reply.send(result)
  })

  // POST /api/auth/logout
  app.post('/logout', { preHandler: authenticate() }, async (_request, reply) => {
    return reply.send({ message: 'Logout berhasil' })
  })

  // GET /api/auth/me
  app.get('/me', { preHandler: authenticate() }, async (request, reply) => {
    const user = await authService.getUserById(request.user!.userId)
    if (!user) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'User tidak ditemukan' })
    return reply.send(user)
  })
}

export async function userRoutes(app: FastifyInstance) {
  // GET /api/users
  app.get('/', { preHandler: authenticate(['admin']) }, async (_request, reply) => {
    return reply.send(await authService.getUsers())
  })

  // POST /api/users
  app.post('/', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const body = UserInputSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }
    try {
      const user = await authService.createUser(body.data)
      return reply.status(201).send(user)
    } catch {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Email sudah digunakan' })
    }
  })

  // PUT /api/users/:id
  app.put('/:id', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = UserUpdateSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: body.error.errors[0].message })
    }
    try {
      return reply.send(await authService.updateUser(id, body.data))
    } catch {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'User tidak ditemukan' })
    }
  })

  // DELETE /api/users/:id
  app.delete('/:id', { preHandler: authenticate(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      await authService.deleteUser(id)
      return reply.status(204).send()
    } catch {
      return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'User tidak ditemukan' })
    }
  })
}
