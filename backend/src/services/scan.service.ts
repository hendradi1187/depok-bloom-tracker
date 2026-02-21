import { PrismaClient } from '@prisma/client'
import { ScanInput, ScanQuery } from '../schemas/scan.schema'

const prisma = new PrismaClient()

export async function createScan(data: ScanInput, userId?: string) {
  const plant = await prisma.plant.findUnique({ where: { barcode: data.barcode } })
  if (!plant) return null

  return prisma.scanRecord.create({
    data: {
      plant_id: plant.id,
      user_id: userId ?? null,
      location: data.location ?? '',
    },
    include: {
      plant: {
        select: {
          id: true, barcode: true, common_name: true, latin_name: true,
          category: { select: { name: true } }, location: true,
          images: { select: { url: true } },
        },
      },
    },
  })
}

export async function getScans(query: ScanQuery) {
  const { page, limit, plant_id } = query
  const skip = (page - 1) * limit
  const where = plant_id ? { plant_id } : {}

  const [total, scans] = await Promise.all([
    prisma.scanRecord.count({ where }),
    prisma.scanRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scanned_at: 'desc' },
      include: {
        plant: {
          select: {
            id: true, barcode: true, common_name: true, latin_name: true,
            category: { select: { name: true } },
          },
        },
      },
    }),
  ])

  return {
    data: scans,
    meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
  }
}

export async function getScanStats(period: 'daily' | 'weekly' | 'monthly') {
  const days = period === 'daily' ? 7 : period === 'weekly' ? 28 : 90
  const since = new Date()
  since.setDate(since.getDate() - days)

  const scans = await prisma.scanRecord.findMany({
    where: { scanned_at: { gte: since } },
    select: { scanned_at: true },
    orderBy: { scanned_at: 'asc' },
  })

  // Group by date
  const grouped: Record<string, number> = {}
  for (const scan of scans) {
    const date = scan.scanned_at.toISOString().split('T')[0]
    grouped[date] = (grouped[date] ?? 0) + 1
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

export async function getStatsSummary() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)

  const [total_plants, total_scans, total_categories, total_users, scans_today, scans_this_week] =
    await Promise.all([
      prisma.plant.count(),
      prisma.scanRecord.count(),
      prisma.category.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.scanRecord.count({ where: { scanned_at: { gte: today } } }),
      prisma.scanRecord.count({ where: { scanned_at: { gte: thisWeek } } }),
    ])

  return { total_plants, total_scans, total_categories, total_users, scans_today, scans_this_week }
}
