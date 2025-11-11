import { ajaxFunctions } from "../ajax-functions.js"

export const responseErrorInterceptor = async error => {
  return await ajaxFunctions.manageError(error)
}