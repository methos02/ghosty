import { abortManager } from '@/services/ajax/src/models/abort-manager.js'
import { Request } from '@/services/ajax/src/models/request.js'

const headersDefault = {
  'X-Requested-With': 'XMLHttpRequest',
}

export const requestInterceptor = (config = {}) => {
  if (abortManager.getAbort() !== undefined) {
    config.signal = abortManager.abortSignal()
  }

  config.credentials = 'include'
  config.headers = Object.assign({}, headersDefault, Request.get('headers', config.requestId) ?? {})
  return config
}
