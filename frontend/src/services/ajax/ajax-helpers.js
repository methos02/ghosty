import { STATUS } from './ajax-constants.js'

const isAuthError = status => {
    return status === STATUS.UNAUTHORIZED || status === STATUS.FORBIDDEN
}

export const AjaxHelpers = { isAuthError }