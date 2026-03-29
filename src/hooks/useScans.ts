import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PaginatedResponse, ScanRecord, StatsSummary } from '@/types/api'

export type ScanPeriod = 'daily' | 'weekly' | 'monthly'
export interface ScanStat { date: string; count: number }

interface UseScansOptions {
  page?: number;
  limit?: number;
  userId?: string;
  enabled?: boolean;
}

export function useScans(options: UseScansOptions = {}) {
  const { page = 1, limit = 20, userId, enabled = true } = options;
  const userIdParam = userId ? `&userId=${userId}` : '';

  return useQuery<PaginatedResponse<ScanRecord>>({
    queryKey: ['scans', page, limit, userId],
    queryFn: () => api.get(`/api/scans?page=${page}&limit=${limit}${userIdParam}`),
    enabled,
  })
}

export function useScanStats(period: ScanPeriod = 'daily') {
  return useQuery<ScanStat[]>({
    queryKey: ['scans', 'stats', period],
    queryFn: () => api.get(`/api/scans/stats?period=${period}`),
  })
}

export function useStatsSummary() {
  return useQuery<StatsSummary>({
    queryKey: ['stats', 'summary'],
    queryFn: () => api.get('/api/stats/summary'),
    refetchInterval: 60 * 1000, // refresh tiap 1 menit
  })
}

export function useCreateScan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { barcode: string; location?: string }) =>
      api.post<ScanRecord>('/api/scans', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scans'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
