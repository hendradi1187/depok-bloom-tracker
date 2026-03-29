import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Plant, PaginatedResponse } from '@/types/api'

interface PlantQuery {
  search?: string
  category?: string
  page?: number
  limit?: number
}

export function usePlants(query: PlantQuery = {}) {
  const params = new URLSearchParams()
  if (query.search) params.set('search', query.search)
  if (query.category) params.set('category', query.category)
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  const qs = params.toString()

  return useQuery<PaginatedResponse<Plant>>({
    queryKey: ['plants', query],
    queryFn: () => api.get(`/api/plants${qs ? `?${qs}` : ''}`),
  })
}

export function usePlant(id: string) {
  return useQuery<Plant>({
    queryKey: ['plants', id],
    queryFn: () => api.get(`/api/plants/${id}`),
    enabled: !!id,
  })
}

export function usePlantByBarcode(barcode: string) {
  return useQuery<Plant>({
    queryKey: ['plants', 'barcode', barcode],
    queryFn: () => api.get(`/api/plants/barcode/${encodeURIComponent(barcode)}`),
    enabled: !!barcode,
    retry: false,
  })
}

export function useCreatePlant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Plant>) => api.post<Plant>('/api/plants', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useUpdatePlant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Plant> }) =>
      api.put<Plant>(`/api/plants/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useDeletePlant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/plants/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plants'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
