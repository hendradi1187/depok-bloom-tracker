import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginInput, UserInput, UserUpdate } from '../schemas/auth.schema'

const prisma = new PrismaClient()

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  is_active: true,
  created_at: true,
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user || !user.is_active) return null

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) return null

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 86400) }
  )

  return {
    access_token: token,
    expires_in: Number(process.env.JWT_EXPIRES_IN ?? 86400),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, is_active: user.is_active, created_at: user.created_at },
  }
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: userSelect })
}

export async function getUsers() {
  return prisma.user.findMany({ select: userSelect, orderBy: { created_at: 'asc' } })
}

export async function createUser(data: UserInput) {
  const hashed = await bcrypt.hash(data.password, 10)
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, role: data.role },
    select: userSelect,
  })
}

export async function updateUser(id: string, data: UserUpdate) {
  return prisma.user.update({ where: { id }, data, select: userSelect })
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
}
