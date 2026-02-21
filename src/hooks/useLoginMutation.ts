import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AuthToken } from '@/types/api'
import { useAuth } from '@/context/AuthContext'

export function useLoginMutation() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthToken>('/api/auth/login', data),
    onSuccess: (res) => {
      login(res.access_token, res.user)
    },
  })
}
