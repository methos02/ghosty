import { Request } from '@/services/ajax/src/models/request.js'
import { requestInterceptor } from '@/services/ajax/src/models/request-interceptor.js'
import { responseErrorInterceptor } from '@/services/ajax/src/models/response-error-interceptor.js'

const deleteRequest = async requestId => {
  const url = Request.get('url', requestId)
  const config = {
    requestId,
    params: Request.get('params', requestId),
    body: Request.get('body', requestId) ?? {},
  }
  const responseType = Request.get('responseType', requestId)
  if (responseType) {
    config.responseType = responseType
  }
  return await internals.executeFetch(url, 'DELETE', config)
}

const get = async requestId => {
  const url = Request.get('url', requestId)
  const config = { requestId, params: Request.get('params', requestId) }
  const responseType = Request.get('responseType', requestId)
  if (responseType) {
    config.responseType = responseType
  }
  return await internals.executeFetch(url, 'GET', config)
}

const patch = async requestId => {
  const url = Request.get('url', requestId)
  const config = {
    requestId,
    params: Request.get('params', requestId),
    body: Request.get('body', requestId) ?? {},
  }
  const responseType = Request.get('responseType', requestId)
  if (responseType) {
    config.responseType = responseType
  }
  return await internals.executeFetch(url, 'PATCH', config)
}

const post = async requestId => {
  const url = Request.get('url', requestId)
  const config = {
    requestId,
    params: Request.get('params', requestId),
    body: Request.get('body', requestId) ?? {},
  }
  const responseType = Request.get('responseType', requestId)
  if (responseType) {
    config.responseType = responseType
  }
  return await internals.executeFetch(url, 'POST', config)
}

const put = async requestId => {
  const url = Request.get('url', requestId)
  const config = {
    requestId,
    params: Request.get('params', requestId),
    body: Request.get('body', requestId) ?? {},
  }
  const responseType = Request.get('responseType', requestId)
  if (responseType) {
    config.responseType = responseType
  }
  return await internals.executeFetch(url, 'PUT', config)
}

const rawRequest = async requestConfig => {
  const options = {
    method: requestConfig.method,
    headers: { ...requestConfig.headers },
    credentials: requestConfig.credentials ?? 'include',
  }

  if (requestConfig.data && !['GET', 'HEAD'].includes(requestConfig.method)) {
    internals.applyBody(options, requestConfig.data)
  }

  const fetchResponse = await fetch(requestConfig.url, options)
  const response = await internals.normalizeResponse(
    fetchResponse,
    requestConfig.responseType,
  )

  if (!fetchResponse.ok) {
    throw internals.createHttpError(
      `Request failed with status ${response.status}`,
      requestConfig,
      { response, code: 'ERR_UNKNOWN' },
    )
  }

  return response
}

export const httpClient = {
  delete: deleteRequest,
  get,
  patch,
  post,
  put,
  rawRequest,
}

const applyBody = (fetchOptions, body) => {
  if (body instanceof globalThis.FormData) {
    fetchOptions.body = body
    return
  }

  if (body === undefined || body === null || Object.keys(body).length === 0) {
    return
  }

  fetchOptions.headers['Content-Type'] ??= 'application/json'
  fetchOptions.body = JSON.stringify(body)
}

const buildUrl = (url, params) => {
  if (!params || Object.keys(params).length === 0) {
    return url
  }
  return `${url}?${internals.customParamsSerializer(params)}`
}

const createHttpError = (message, requestConfig, options = {}) => {
  return Object.assign(new Error(message), {
    config: requestConfig,
    response: options.response,
    code: options.code,
  })
}

const customParamsSerializer = params => {
  const parts = []
  for (const paramName in params) {
    if (params[paramName] === undefined) {
      continue
    }

    const paramValues = params[paramName]
    if (Array.isArray(paramValues)) {
      for (const paramValue of paramValues) {
        parts.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`)
      }

      continue
    }

    parts.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(params[paramName])}`)
  }
  return parts.join('&')
}

const executeFetch = async (url, method, config) => {
  const preparedRequest = internals.prepareFetchRequest(config, method, url)
  const fetchResponse = await internals.sendFetch(preparedRequest)
  return await internals.handleFetchResponse(fetchResponse, preparedRequest)
}

const handleFetchResponse = async (fetchResponse, preparedRequest) => {
  const response = await internals.normalizeResponse(
    fetchResponse,
    preparedRequest.config.responseType,
  )

  if (!fetchResponse.ok) {
    return await responseErrorInterceptor(
      internals.createHttpError(
        `Request failed with status ${response.status}`,
        preparedRequest.config,
        { response, code: 'ERR_UNKNOWN' },
      ),
    )
  }

  return response
}

const prepareFetchRequest = (config, method, url) => {
  const fullUrl = internals.buildUrl(url, config.params)
  const body = config.body
  const interceptedConfig = requestInterceptor({ ...config })
  const headers = { ...interceptedConfig.headers }

  const fetchOptions = { method: method.toUpperCase(), headers }
  if (interceptedConfig.credentials) {
    fetchOptions.credentials = interceptedConfig.credentials
  }
  if (interceptedConfig.signal) {
    fetchOptions.signal = interceptedConfig.signal
  }

  internals.applyBody(fetchOptions, body)

  const requestConfig = {
    url: fullUrl,
    headers,
    method: method.toUpperCase(),
    data: body,
    requestId: config.requestId,
    responseType: config.responseType,
    credentials: interceptedConfig.credentials,
  }
  if (interceptedConfig.signal) {
    requestConfig.signal = interceptedConfig.signal
  }

  return {
    url: fullUrl,
    fetchOptions,
    config: requestConfig,
  }
}

const sendFetch = async preparedRequest => {
  try {
    return await fetch(preparedRequest.url, preparedRequest.fetchOptions)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw internals.createHttpError('Request aborted', preparedRequest.config, {
        code: 'ERR_CANCELED',
      })
    }

    throw internals.createHttpError('Network error', preparedRequest.config)
  }
}

const normalizeHeaders = fetchHeaders => {
  return Object.fromEntries(fetchHeaders.entries())
}

const normalizeResponse = async (fetchResponse, responseType) => {
  const headers = internals.normalizeHeaders(fetchResponse.headers)

  if (responseType === 'blob') {
    const data = await fetchResponse.blob()
    return {
      data,
      status: fetchResponse.status,
      headers,
      statusText: fetchResponse.statusText,
    }
  }

  const text = await fetchResponse.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return {
    data,
    status: fetchResponse.status,
    headers,
    statusText: fetchResponse.statusText,
  }
}

export const internals = {
  applyBody,
  buildUrl,
  createHttpError,
  customParamsSerializer,
  executeFetch,
  handleFetchResponse,
  normalizeHeaders,
  normalizeResponse,
  prepareFetchRequest,
  sendFetch,
}
