import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'

// ─── Mock service layer (bukan Prisma langsung) ────────────────────────────
vi.mock('../../services/plant.service', () => ({
  getPlants: vi.fn(),
  getPlantById: vi.fn(),
  getPlantByBarcode: vi.fn(),
  createPlant: vi.fn(),
  updatePlant: vi.fn(),
  deletePlant: vi.fn(),
}))

import * as plantService from '../../services/plant.service'
import { plantRoutes } from '../plant.route'

// ─── Konstanta test ────────────────────────────────────────────────────────
const JWT_SECRET = 'test-jwt-secret'
process.env.JWT_SECRET = JWT_SECRET

function makeToken(role = 'admin') {
  return jwt.sign({ userId: 'user-1', email: 'admin@test.com', role }, JWT_SECRET)
}

const mockPlant = {
  id: 'plant-1',
  barcode: 'DPK-ORN-001',
  common_name: 'Bougainvillea',
  latin_name: 'Bougainvillea spectabilis',
  category: 'Tanaman Merambat',
  description: '',
  care_guide: '',
  location: '',
  supplier: '',
  supplier_contact: '',
  price: null,
  status: 'available' as const,
  grade: null,
  latitude: null,
  longitude: null,
  images: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ─── Setup & teardown ──────────────────────────────────────────────────────
let app: FastifyInstance

beforeAll(async () => {
  app = Fastify({ logger: false })
  await app.register(plantRoutes, { prefix: '/api/plants' })
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => vi.clearAllMocks())

// ─── Tests ─────────────────────────────────────────────────────────────────
describe('GET /api/plants', () => {
  it('mengembalikan 200 dengan daftar tanaman dan meta', async () => {
    vi.mocked(plantService.getPlants).mockResolvedValue({
      data: [mockPlant],
      meta: { total: 1, page: 1, limit: 20, total_pages: 1 },
    })

    const res = await app.inject({ method: 'GET', url: '/api/plants' })

    expect(res.statusCode).toBe(200)
    expect(res.json().data).toHaveLength(1)
    expect(res.json().meta.total).toBe(1)
  })

  it('meneruskan query params ke service', async () => {
    vi.mocked(plantService.getPlants).mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 5, total_pages: 0 } })

    await app.inject({ method: 'GET', url: '/api/plants?search=melati&page=2&limit=5' })

    expect(plantService.getPlants).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'melati', page: 2, limit: 5 }),
    )
  })
})

describe('GET /api/plants/barcode/:barcode', () => {
  it('mengembalikan 200 jika barcode ditemukan', async () => {
    vi.mocked(plantService.getPlantByBarcode).mockResolvedValue(mockPlant)

    const res = await app.inject({ method: 'GET', url: '/api/plants/barcode/DPK-ORN-001' })

    expect(res.statusCode).toBe(200)
    expect(res.json().barcode).toBe('DPK-ORN-001')
  })

  it('mengembalikan 404 jika barcode tidak ada', async () => {
    vi.mocked(plantService.getPlantByBarcode).mockResolvedValue(null)

    const res = await app.inject({ method: 'GET', url: '/api/plants/barcode/TIDAK-ADA' })

    expect(res.statusCode).toBe(404)
  })
})

describe('GET /api/plants/:id', () => {
  it('mengembalikan 200 jika id ditemukan', async () => {
    vi.mocked(plantService.getPlantById).mockResolvedValue(mockPlant)

    const res = await app.inject({ method: 'GET', url: '/api/plants/plant-1' })

    expect(res.statusCode).toBe(200)
    expect(res.json().id).toBe('plant-1')
  })

  it('mengembalikan 404 jika id tidak ada', async () => {
    vi.mocked(plantService.getPlantById).mockResolvedValue(null)

    const res = await app.inject({ method: 'GET', url: '/api/plants/tidak-ada' })

    expect(res.statusCode).toBe(404)
  })
})

describe('POST /api/plants', () => {
  const validPayload = {
    barcode: 'DPK-ORN-099',
    common_name: 'Test Plant',
    latin_name: 'Testus plantus',
    category: 'Perdu',
  }

  it('mengembalikan 401 tanpa Authorization header', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/plants', payload: validPayload })
    expect(res.statusCode).toBe(401)
  })

  it('mengembalikan 403 jika role bukan admin', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/plants',
      headers: { authorization: `Bearer ${makeToken('officer')}` },
      payload: validPayload,
    })
    expect(res.statusCode).toBe(403)
  })

  it('mengembalikan 201 dengan data tanaman baru jika admin', async () => {
    vi.mocked(plantService.createPlant).mockResolvedValue(mockPlant)

    const res = await app.inject({
      method: 'POST',
      url: '/api/plants',
      headers: { authorization: `Bearer ${makeToken('admin')}` },
      payload: validPayload,
    })

    expect(res.statusCode).toBe(201)
    expect(plantService.createPlant).toHaveBeenCalledWith(
      expect.objectContaining({ barcode: 'DPK-ORN-099' }),
    )
  })

  it('mengembalikan 400 jika barcode duplikat', async () => {
    vi.mocked(plantService.createPlant).mockRejectedValue(new Error('Unique constraint'))

    const res = await app.inject({
      method: 'POST',
      url: '/api/plants',
      headers: { authorization: `Bearer ${makeToken('admin')}` },
      payload: validPayload,
    })

    expect(res.statusCode).toBe(400)
  })
})

describe('DELETE /api/plants/:id', () => {
  it('mengembalikan 204 jika berhasil dihapus', async () => {
    vi.mocked(plantService.deletePlant).mockResolvedValue(undefined)

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/plants/plant-1',
      headers: { authorization: `Bearer ${makeToken('admin')}` },
    })

    expect(res.statusCode).toBe(204)
  })

  it('mengembalikan 401 tanpa token', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/plants/plant-1' })
    expect(res.statusCode).toBe(401)
  })
})
