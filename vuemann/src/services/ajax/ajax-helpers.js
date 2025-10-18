import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'

const isAuthError = status => {
    return status === STATUS.UNAUTHORIZED || status === STATUS.FORBIDDEN
}

const isSuccess = status => {
    return String(status).startsWith('20')
}

export const AjaxHelpers = { isAuthError, isSuccess }
