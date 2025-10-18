import { ajaxFunctions } from "@brugmann/vuemann/src/services/ajax/src/ajax-functions.js"
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"
import { Request } from "@brugmann/vuemann/src/services/ajax/src/models/request.js"
import { STATUS } from "@brugmann/vuemann/src/services/ajax/ajax-constants.js"

export const responseErrorInterceptor = async error => {
  const requestId = error.config.requestId
  if (error.response === undefined || Request.get('retryRefresh', requestId) === false) { return await ajaxFunctions.manageError(error) }

  const response = await servicesM.service('auth:refreshToken', [Request.get('api', requestId), error.response])
  if (response.status !== STATUS.SUCCESS) { return await ajaxFunctions.manageError(error) }

  error.config.headers['Authorization'] = 'Bearer ' + response.access_token

  const resendResponse = await ajaxFunctions.resendRequest(error.config)
  return { api: Request.get('api', requestId), route: Request.get('route', requestId), ...resendResponse }
}
