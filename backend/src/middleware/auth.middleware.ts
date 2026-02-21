import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}

export function authenticate(roles?: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token tidak disertakan',
      })
    }

    const token = authHeader.slice(7)
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      request.user = payload

      if (roles && !roles.includes(payload.role)) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Tidak memiliki hak akses',
        })
      }
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token tidak valid atau sudah kedaluwarsa',
      })
    }
  }
}
