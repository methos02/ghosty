import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'

const state = {
  requests: {},
  counter: 0,
}

const init = (route, options) => {
  const requestId = RequestFunctions.generateRequestId()

  state.requests[requestId] = {
    id: requestId,
    api: route.api,
    route: route,
    ...options,
  }

  RequestFunctions.cleanParametersRequest(requestId)
  return requestId
}

const set = (datas, requestId) => {
  for (const key in datas) {
    state.requests[requestId][key] = datas[key]
  }
}

const get = (key, requestId) => {
  if (key === undefined) {
    return state.requests
  }

  if (requestId === undefined) {
    return state.requests[key]
  }

  if (state.requests[requestId] === undefined) {
    throw new Error(`Request ${requestId} not found`)
  }

  return utilsH.getNestedProperty(state.requests[requestId], key)
}

const remove = requestId => {
  delete state.requests[requestId]
}

const cleanParametersRequest = requestId => {
  const params = Request.get('params', requestId)

  for (const parameter_name in params) {
    if (params[parameter_name] === '') {
      delete params[parameter_name]
    }
  }

  Request.set({ params }, requestId)
}

export const Request = {
  init,
  get,
  set,
  remove,
}

const LENGTH = 36
const generateRequestId = () => {
  return (state.counter++).toString(LENGTH)
}

export const RequestFunctions = {
  cleanParametersRequest,
  generateRequestId,
}
