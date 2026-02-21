import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Category } from '@/types/api'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
    staleTime: 5 * 60 * 1000, // 5 menit
  })
}
