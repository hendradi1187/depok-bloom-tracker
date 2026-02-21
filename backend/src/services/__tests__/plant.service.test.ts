import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Prisma (vi.mock di-hoist otomatis oleh vitest) ───────────────────
vi.mock('@prisma/client', () => {
  const plant = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
  const category = { upsert: vi.fn() }
  return { PrismaClient: vi.fn(() => ({ plant, category })) }
})

import { PrismaClient } from '@prisma/client'
import {
  getPlants,
  getPlantById,
  getPlantByBarcode,
  createPlant,
  deletePlant,
} from '../plant.service'

// Ambil referensi ke mock instance (berbagi objek yang sama dengan service)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new (PrismaClient as any)()

// ─── Data fixture ──────────────────────────────────────────────────────────
const rawPlant = {
  id: 'plant-1',
  barcode: 'DPK-ORN-001',
  common_name: 'Bougainvillea',
  latin_name: 'Bougainvillea spectabilis',
  category: { name: 'Tanaman Merambat' },
  description: 'Tanaman hias merambat',
  care_guide: 'Siram 2x sehari',
  location: 'Kec. Pancoran Mas',
  supplier: 'Dinas LH Depok',
  supplier_contact: '',
  price: null,
  status: 'available',
  grade: null,
  latitude: -6.4025,
  longitude: 106.7942,
  images: [{ url: 'https://example.com/img.jpg' }],
  created_at: new Date(),
  updated_at: new Date(),
}

// ─── Tests ─────────────────────────────────────────────────────────────────
describe('PlantService', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── getPlants ─────────────────────────────────────────────────────────
  describe('getPlants', () => {
    it('mengembalikan daftar tanaman dengan meta pagination', async () => {
      db.plant.count.mockResolvedValue(1)
      db.plant.findMany.mockResolvedValue([rawPlant])

      const result = await getPlants({ page: 1, limit: 20 })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].category).toBe('Tanaman Merambat')
      expect(result.data[0].images).toEqual(['https://example.com/img.jpg'])
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, total_pages: 1 })
    })

    it('menghitung total_pages dengan benar', async () => {
      db.plant.count.mockResolvedValue(25)
      db.plant.findMany.mockResolvedValue([])

      const result = await getPlants({ page: 1, limit: 10 })
      expect(result.meta.total_pages).toBe(3)
    })

    it('meneruskan filter search ke prisma WHERE clause', async () => {
      db.plant.count.mockResolvedValue(0)
      db.plant.findMany.mockResolvedValue([])

      await getPlants({ search: 'bougainvillea', page: 1, limit: 20 })

      expect(db.plant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      )
    })

    it('meneruskan filter category ke prisma WHERE clause', async () => {
      db.plant.count.mockResolvedValue(0)
      db.plant.findMany.mockResolvedValue([])

      await getPlants({ category: 'Perdu', page: 1, limit: 20 })

      expect(db.plant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: expect.any(Object) }),
        }),
      )
    })
  })

  // ── getPlantById ──────────────────────────────────────────────────────
  describe('getPlantById', () => {
    it('mengembalikan null jika tanaman tidak ditemukan', async () => {
      db.plant.findUnique.mockResolvedValue(null)
      expect(await getPlantById('tidak-ada')).toBeNull()
    })

    it('mengembalikan plant yang sudah diformat jika ditemukan', async () => {
      db.plant.findUnique.mockResolvedValue(rawPlant)
      const result = await getPlantById('plant-1')
      expect(result?.common_name).toBe('Bougainvillea')
      expect(result?.category).toBe('Tanaman Merambat') // di-flatten
    })
  })

  // ── getPlantByBarcode ─────────────────────────────────────────────────
  describe('getPlantByBarcode', () => {
    it('mengembalikan null jika barcode tidak ada', async () => {
      db.plant.findUnique.mockResolvedValue(null)
      expect(await getPlantByBarcode('TIDAK-ADA')).toBeNull()
    })

    it('mengembalikan plant jika barcode ditemukan', async () => {
      db.plant.findUnique.mockResolvedValue(rawPlant)
      const result = await getPlantByBarcode('DPK-ORN-001')
      expect(result?.barcode).toBe('DPK-ORN-001')
    })
  })

  // ── createPlant ───────────────────────────────────────────────────────
  describe('createPlant', () => {
    it('melakukan upsert kategori sebelum membuat tanaman', async () => {
      db.category.upsert.mockResolvedValue({ id: 'cat-1', name: 'Perdu' })
      db.plant.create.mockResolvedValue({ ...rawPlant, category: { name: 'Perdu' } })

      await createPlant({
        barcode: 'DPK-PRD-001',
        common_name: 'Melati',
        latin_name: 'Jasminum sambac',
        category: 'Perdu',
      })

      expect(db.category.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'Perdu' } }),
      )
      expect(db.plant.create).toHaveBeenCalled()
    })
  })

  // ── deletePlant ───────────────────────────────────────────────────────
  describe('deletePlant', () => {
    it('memanggil prisma.plant.delete dengan id yang benar', async () => {
      db.plant.delete.mockResolvedValue({})
      await deletePlant('plant-123')
      expect(db.plant.delete).toHaveBeenCalledWith({ where: { id: 'plant-123' } })
    })
  })
})
