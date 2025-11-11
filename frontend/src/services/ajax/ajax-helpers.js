import { STATUS } from './ajax-constants.js'

const isAuthError = status => {
    return status === STATUS.UNAUTHORIZED || status === STATUS.FORBIDDEN
}

const isValidationError = status => {
    return status === STATUS.VALIDATION_ERROR
}

const formatValidationErrors = (laravelErrors) => {
    const formatted = {}
    Object.entries(laravelErrors).forEach(([field, messages]) => {
        formatted[field] = Array.isArray(messages) ? messages[0] : messages
    })

    return formatted
}

export const AjaxHelpers = { isAuthError, isValidationError, formatValidationErrors }