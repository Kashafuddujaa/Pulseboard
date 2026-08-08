import { supabase } from '@/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (session) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}
