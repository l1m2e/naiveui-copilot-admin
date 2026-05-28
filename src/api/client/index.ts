import type { Client, RequestConfig, RequestCredentials, ResponseConfig } from '@kubb/plugin-client/clients/fetch'

export type { Client, RequestConfig, RequestCredentials, ResponseConfig }

export type ResponseErrorConfig<TError = unknown> = ApiError<TError>

export class ApiError<TData = unknown> extends Error {
  constructor(
    message: string,
    readonly data: TData,
    readonly response: Response,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const defaultBaseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function resolveUrl(url = '', baseURL = defaultBaseURL) {
  if (isAbsoluteUrl(url)) return url

  const normalizedBaseURL = baseURL.replace(/\/$/, '')
  const normalizedUrl = url.replace(/^\//, '')

  return [normalizedBaseURL, normalizedUrl].filter(Boolean).join('/')
}

function appendParams(url: string, params?: unknown) {
  if (!params || typeof params !== 'object') return url

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)))
      return
    }

    searchParams.append(key, String(value))
  })

  const query = searchParams.toString()
  if (!query) return url

  return `${url}${url.includes('?') ? '&' : '?'}${query}`
}

function mergeHeaders(headers?: RequestConfig['headers'], hasJsonBody = false) {
  const result = new Headers(headers)

  if (hasJsonBody && !result.has('Content-Type')) {
    result.set('Content-Type', 'application/json')
  }

  return result
}

async function parseResponse(response: Response, responseType?: RequestConfig['responseType']) {
  if ([204, 205, 304].includes(response.status) || !response.body) return {}
  if (responseType === 'blob') return response.blob()
  if (responseType === 'arraybuffer') return response.arrayBuffer()
  if (responseType === 'text') return response.text()

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) return response.json()

  return response.text()
}

const client: Client = async <TResponseData, _TError = unknown, TRequestData = unknown>(config: RequestConfig<TRequestData>): Promise<ResponseConfig<TResponseData>> => {
  const requestUrl = appendParams(resolveUrl(config.url, config.baseURL), config.params)
  const hasJsonBody = config.data !== undefined && !(config.data instanceof FormData)
  const mergedHeaders = mergeHeaders(config.headers, hasJsonBody)
  const token = sessionStorage.getItem('mastra-token')
  if (token) {
    mergedHeaders.set('X-Mastra-Admin-Token', token)
  }
  const response = await fetch(requestUrl, {
    body: config.data instanceof FormData ? config.data : hasJsonBody ? JSON.stringify(config.data) : undefined,
    credentials: config.credentials ?? 'include',
    headers: mergedHeaders,
    method: config.method?.toUpperCase(),
    signal: config.signal,
  })
  const data = await parseResponse(response, config.responseType)

  if (!response.ok) {
    throw new ApiError(response.statusText || 'Request failed', data, response)
  }

  return {
    data: data as TResponseData,
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  }
}

export default client
