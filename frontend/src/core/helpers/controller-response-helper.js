import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const buildResponse = async (response, mapData) => {
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return controllerResponseHelperInternal.buildSuccess(response, mapData)
}

export const controllerResponseHelper = {
  buildResponse,
}

const buildSuccess = async (response, mapData) => {
  if (mapData === undefined) {
    return { status: STATUS.SUCCESS }
  }

  const datasMapped = await mapData(response.data)
  return {
    ...datasMapped,
    status: STATUS.SUCCESS,
  }
}

export const controllerResponseHelperInternal = {
  buildSuccess,
}
