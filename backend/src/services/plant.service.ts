import { PrismaClient } from '@prisma/client'
import { PlantInput, PlantQuery } from '../schemas/plant.schema'

const prisma = new PrismaClient()

// Mapping kategori ke kode 3 huruf untuk barcode
const categoryCodeMap: Record<string, string> = {
  'Tanaman Hias': 'HIA',
  'Tanaman Merambat': 'MER',
  'Bunga Potong': 'POT',
  'Perdu': 'PRD',
  'Pohon Hias': 'POH',
  'Tanaman Air': 'AIR',
  'Sukulen': 'SUK',
  'Bonsai': 'BON',
}

// Auto-generate barcode berdasarkan kategori
async function generateBarcode(categoryName: string): Promise<string> {
  // Ambil kode kategori, default 'ORN' jika tidak ada mapping
  const catCode = categoryCodeMap[categoryName] || 'ORN'

  // Cari tanaman terakhir dengan prefix kategori yang sama
  const lastPlant = await prisma.plant.findFirst({
    where: { barcode: { startsWith: `DPK-${catCode}-` } },
    orderBy: { barcode: 'desc' },
    select: { barcode: true },
  })

  let counter = 1
  if (lastPlant) {
    // Extract nomor dari barcode terakhir (DPK-CAT-007 → 007)
    const match = lastPlant.barcode.match(/-(\d{3})$/)
    if (match) {
      counter = parseInt(match[1], 10) + 1
    }
  }

  // Format: DPK-CAT-001, DPK-CAT-002, dst
  return `DPK-${catCode}-${counter.toString().padStart(3, '0')}`
}

const plantSelect = {
  id: true,
  barcode: true,
  common_name: true,
  latin_name: true,
  category: { select: { name: true } },
  description: true,
  care_guide: true,
  location: true,
  supplier: true,
  supplier_contact: true,
  price: true,
  status: true,
  grade: true,
  latitude: true,
  longitude: true,
  images: { select: { url: true } },
  created_at: true,
  updated_at: true,
}

function formatPlant(plant: any) {
  return {
    ...plant,
    category: plant.category.name,
    images: plant.images.map((img: any) => img.url),
  }
}

export async function getPlants(query: PlantQuery) {
  const { search, category, status, page, limit } = query
  const skip = (page - 1) * limit

  const where: any = {}
  if (search) {
    where.OR = [
      { common_name: { contains: search, mode: 'insensitive' } },
      { latin_name: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (category) {
    where.category = { name: { equals: category, mode: 'insensitive' } }
  }
  if (status) {
    where.status = status
  }

  const [total, plants] = await Promise.all([
    prisma.plant.count({ where }),
    prisma.plant.findMany({ where, select: plantSelect, skip, take: limit, orderBy: { created_at: 'desc' } }),
  ])

  return {
    data: plants.map(formatPlant),
    meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
  }
}

export async function getPlantById(id: string) {
  const plant = await prisma.plant.findUnique({ where: { id }, select: plantSelect })
  if (!plant) return null
  return formatPlant(plant)
}

export async function getPlantByBarcode(barcode: string) {
  const plant = await prisma.plant.findUnique({ where: { barcode }, select: plantSelect })
  if (!plant) return null
  return formatPlant(plant)
}

export async function createPlant(data: PlantInput) {
  const category = await prisma.category.upsert({
    where: { name: data.category },
    update: {},
    create: { name: data.category },
  })

  // Auto-generate barcode jika tidak ada
  const barcode = data.barcode || (await generateBarcode(data.category))

  const plant = await prisma.plant.create({
    data: {
      barcode,
      common_name: data.common_name,
      latin_name: data.latin_name,
      category_id: category.id,
      description: data.description ?? '',
      care_guide: data.care_guide ?? '',
      location: data.location ?? '',
      supplier: data.supplier ?? '',
      supplier_contact: data.supplier_contact ?? '',
      price: data.price ?? null,
      status: data.status ?? 'available',
      grade: data.grade ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      // Tambah images jika ada
      images: data.images && data.images.length > 0
        ? { create: data.images.map((url) => ({
            url,
            filename: url.split('/').pop() || 'unknown.jpg'
          })) }
        : undefined,
    },
    select: plantSelect,
  })

  return formatPlant(plant)
}

export async function updatePlant(id: string, data: PlantInput) {
  const category = await prisma.category.upsert({
    where: { name: data.category },
    update: {},
    create: { name: data.category },
  })

  // Jika ada images di request, replace semua images
  const imagesUpdate = data.images
    ? {
        // Hapus images lama
        deleteMany: {},
        // Tambah images baru
        create: data.images.map((url) => ({
          url,
          filename: url.split('/').pop() || 'unknown.jpg'
        })),
      }
    : undefined

  const plant = await prisma.plant.update({
    where: { id },
    data: {
      barcode: data.barcode,
      common_name: data.common_name,
      latin_name: data.latin_name,
      category_id: category.id,
      description: data.description ?? '',
      care_guide: data.care_guide ?? '',
      location: data.location ?? '',
      supplier: data.supplier ?? '',
      supplier_contact: data.supplier_contact ?? '',
      price: data.price ?? null,
      status: data.status ?? 'available',
      grade: data.grade ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      images: imagesUpdate,
    },
    select: plantSelect,
  })

  return formatPlant(plant)
}

export async function deletePlant(id: string) {
  await prisma.plant.delete({ where: { id } })
}
