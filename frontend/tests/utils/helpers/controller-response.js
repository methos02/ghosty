import { STATUS } from '@/constants/ajax-constants.js'

export const controllerSuccess = (data = {}) => ({ status: STATUS.SUCCESS, ...data })

export const controllerError = (status = STATUS.ERROR_SERVER, error = 'boom') => ({ status, error })
