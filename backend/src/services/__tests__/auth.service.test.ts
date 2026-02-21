import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock dependencies ──────────────────────────────────────────────────────
vi.mock('@prisma/client', () => {
  const user = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
  return { PrismaClient: vi.fn(() => ({ user })) }
})

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
}))

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'mock-jwt-token'), verify: vi.fn() },
}))

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { login } from '../auth.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new (PrismaClient as any)()

const mockUser = {
  id: 'user-1',
  name: 'Admin Flora Depok',
  email: 'admin@depok.go.id',
  password: '$2b$10$hashedpassword',
  role: 'admin',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
}

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-jwt-secret'
    process.env.JWT_EXPIRES_IN = '86400'
  })

  describe('login', () => {
    it('mengembalikan null jika user tidak ditemukan', async () => {
      db.user.findUnique.mockResolvedValue(null)
      const result = await login({ email: 'tidak@ada.com', password: 'pass' })
      expect(result).toBeNull()
    })

    it('mengembalikan null jika user tidak aktif', async () => {
      db.user.findUnique.mockResolvedValue({ ...mockUser, is_active: false })
      const result = await login({ email: 'admin@depok.go.id', password: 'admin123' })
      expect(result).toBeNull()
    })

    it('mengembalikan null jika password salah', async () => {
      db.user.findUnique.mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)
      const result = await login({ email: 'admin@depok.go.id', password: 'salah' })
      expect(result).toBeNull()
    })

    it('mengembalikan token dan data user jika login berhasil', async () => {
      db.user.findUnique.mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await login({ email: 'admin@depok.go.id', password: 'admin123' })

      expect(result).not.toBeNull()
      expect(result?.access_token).toBe('mock-jwt-token')
      expect(result?.user.email).toBe('admin@depok.go.id')
      expect(result?.user.role).toBe('admin')
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', role: 'admin' }),
        'test-jwt-secret',
        expect.any(Object),
      )
    })

    it('memanggil bcrypt.compare dengan password dan hash yang benar', async () => {
      db.user.findUnique.mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      await login({ email: 'admin@depok.go.id', password: 'admin123' })

      expect(bcrypt.compare).toHaveBeenCalledWith('admin123', mockUser.password)
    })
  })
})
