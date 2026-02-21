const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('flora_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('flora_token')
    localStorage.removeItem('flora_user')
    window.location.href = '/login'
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Terjadi kesalahan' }))
    throw new Error(err.message ?? 'Terjadi kesalahan')
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
