import { http, HttpResponse } from 'msw'
import type { Plant, PaginatedResponse } from '@/types/api'

const BASE = 'http://localhost:3000'

const mockPlant: Plant = {
  id: 'plant-1',
  barcode: 'DPK-ORN-001',
  common_name: 'Bougainvillea',
  latin_name: 'Bougainvillea spectabilis',
  category: 'Tanaman Merambat',
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
  images: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockPaginatedPlants: PaginatedResponse<Plant> = {
  data: [mockPlant],
  meta: { total: 1, page: 1, limit: 20, total_pages: 1 },
}

export const handlers = [
  // GET /api/plants
  http.get(`${BASE}/api/plants`, () => HttpResponse.json(mockPaginatedPlants)),

  // GET /api/plants/:id
  http.get(`${BASE}/api/plants/:id`, ({ params }) => {
    if (params.id === 'plant-1') return HttpResponse.json(mockPlant)
    return HttpResponse.json(
      { statusCode: 404, error: 'Not Found', message: 'Tanaman tidak ditemukan' },
      { status: 404 },
    )
  }),

  // GET /api/plants/barcode/:barcode
  http.get(`${BASE}/api/plants/barcode/:barcode`, ({ params }) => {
    if (params.barcode === 'DPK-ORN-001') return HttpResponse.json(mockPlant)
    return HttpResponse.json(
      { statusCode: 404, error: 'Not Found', message: 'Barcode tidak ditemukan' },
      { status: 404 },
    )
  }),
]
