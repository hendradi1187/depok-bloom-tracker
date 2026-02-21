import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'

import { usePlants, usePlant } from '@/hooks/usePlants'
import { server } from '../msw/server'

// ─── Wrapper QueryClient ────────────────────────────────────────────────────
function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

// ─── Tests ─────────────────────────────────────────────────────────────────
describe('usePlants', () => {
  it('mengambil daftar tanaman dari API dan mengembalikan data', async () => {
    const { result } = renderHook(() => usePlants(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].common_name).toBe('Bougainvillea')
    expect(result.current.data?.meta.total).toBe(1)
  })

  it('mengirim parameter search ke URL API', async () => {
    let capturedUrl = ''

    server.use(
      http.get('http://localhost:3000/api/plants', ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 20, total_pages: 0 } })
      }),
    )

    const { result } = renderHook(
      () => usePlants({ search: 'bougainvillea', page: 2 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(capturedUrl).toContain('search=bougainvillea')
    expect(capturedUrl).toContain('page=2')
  })

  it('mengembalikan isLoading=true saat data belum tersedia', () => {
    const { result } = renderHook(() => usePlants(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })
})

describe('usePlant', () => {
  it('mengambil detail tanaman berdasarkan ID', async () => {
    const { result } = renderHook(() => usePlant('plant-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe('plant-1')
    expect(result.current.data?.barcode).toBe('DPK-ORN-001')
  })

  it('mengembalikan isError=true jika ID tidak ditemukan', async () => {
    const { result } = renderHook(() => usePlant('tidak-ada'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('tidak melakukan fetch jika id kosong', () => {
    const { result } = renderHook(() => usePlant(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
