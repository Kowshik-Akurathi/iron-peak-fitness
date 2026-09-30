export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
let csrfToken: string | null = null

async function getCsrfToken() {
  if (csrfToken) return csrfToken
  const response = await fetch(`${apiBaseUrl}/api/v1/auth/csrf`, { credentials: 'include' })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok || !body || typeof body !== 'object' || !('csrfToken' in body) || typeof body.csrfToken !== 'string') throw new ApiError(response.status, 'CSRF_TOKEN_UNAVAILABLE', 'Security token could not be obtained.')
  csrfToken = body.csrfToken
  return csrfToken
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers.set('x-csrf-token', await getCsrfToken())
  const response = await fetch(`${apiBaseUrl}/api/v1${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = body && typeof body === 'object' && 'error' in body && body.error && typeof body.error === 'object' ? body.error as { code?: unknown; message?: unknown; details?: unknown } : undefined
    throw new ApiError(response.status, typeof error?.code === 'string' ? error.code : 'API_ERROR', typeof error?.message === 'string' ? error.message : 'The request could not be completed.', error?.details)
  }
  return body as T
}
