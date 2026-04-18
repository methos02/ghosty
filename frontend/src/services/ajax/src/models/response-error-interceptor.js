import { ajaxFunctions } from "@/services/ajax/src/ajax-functions.js"
import { servicesM } from "@/services/services-manager.js"
import { Request } from "@/services/ajax/src/models/request.js"
import { STATUS } from "@/services/ajax/ajax-constants.js"

export const responseErrorInterceptor = async error => {
  const requestId = error.config?.requestId
  if (error.response === undefined || requestId === undefined || Request.get('retryRefresh', requestId) === false) { return await ajaxFunctions.manageError(error, requestId) }

  const response = await servicesM.service('auth:refreshToken', [Request.get('api', requestId), error.response])
  if (response.status !== STATUS.SUCCESS) { return await ajaxFunctions.manageError(error, requestId) }

  error.config.headers['Authorization'] = 'Bearer ' + response.access_token

  const resendResponse = await ajaxFunctions.resendRequest(error.config)
  return { api: Request.get('api', requestId), route: Request.get('route', requestId), ...resendResponse }
}
