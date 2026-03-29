// Jika VITE_API_URL kosong/undefined, gunakan relative URL (untuk production dengan nginx proxy)
// Jika diset (misal di development), gunakan URL yang diset
const BASE_URL = import.meta.env.VITE_API_URL || ''

function getToken() {
  return localStorage.getItem('flora_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // Hanya set Content-Type jika bukan FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Only redirect to login if we have a token AND get 401
  // This means token is invalid/expired
  // Public users without token getting 401 is expected behavior
  if (res.status === 401 && token) {
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
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
