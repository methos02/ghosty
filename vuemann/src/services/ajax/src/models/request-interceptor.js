import { abortManager } from '@brugmann/vuemann/src/services/ajax/src/models/abort-manager.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';

const headersDefault = {
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*',
}

export const requestInterceptor = (config = {}) => {
  const bearer_token = Request.get('token', config.requestId) ?? servicesM.service('auth:getAccessToken', Request.get('api', config.requestId))
  if (bearer_token !== null) { headersDefault['Authorization'] = 'Bearer ' + bearer_token }

  if (abortManager.getAbort() !== undefined) { config.signal = abortManager.abortSignal() }

  config.headers = Object.assign({}, headersDefault, Request.get('headers', config.requestId) ?? {})
  return config
}
