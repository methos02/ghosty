import { STATUS } from '@/constants/ajax-constants.js'

const SUCCESS_STATUSES = new Set([
    STATUS.SUCCESS, 
    STATUS.CREATED, 
    STATUS.NO_CONTENT
])

const isSuccess = status => SUCCESS_STATUSES.has(status)

export const ajaxHelper = { isSuccess }
