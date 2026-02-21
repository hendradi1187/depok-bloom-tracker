import { PrismaClient } from '@prisma/client'
import { PlantInput, PlantQuery } from '../schemas/plant.schema'

const prisma = new PrismaClient()

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

  const plant = await prisma.plant.create({
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
    },
    select: plantSelect,
  })

  return formatPlant(plant)
}

export async function deletePlant(id: string) {
  await prisma.plant.delete({ where: { id } })
}
