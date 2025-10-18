import { ajaxFunctions } from "@brugmann/vuemann/src/services/ajax/ajax-functions.js"
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"
import { Request } from "./request.js"
import { STATUS } from "../../ajax-constants.js"

export const responseErrorInterceptor = async error => {
  if (error.response === undefined || Request.get('retryRefresh') === false) { return await ajaxFunctions.manageError(error) }

  const response = await servicesM.service('auth:refreshToken', [Request.get('api'), error.response])
  if (response.status !== STATUS.SUCCESS) { return await ajaxFunctions.manageError(error) }

  error.config.headers['Authorization'] = 'Bearer ' + response.access_token

  const resendResponse = await ajaxFunctions.resendRequest(error.config)
  return { api: Request.get('api'), route: Request.get('route'), ...resendResponse }
}