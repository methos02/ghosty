import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'

const isAuthError = status => {
    return status === STATUS.UNAUTHORIZED || status === STATUS.FORBIDDEN
}

export const AjaxHelpers = { isAuthError }