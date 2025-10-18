import { utilsH } from "../../../../helpers/utils-helper.js";

const request = {};

const init = (route, datas, options) => {
  const requestId = RequestFunctions.generateRequestId()

  request[requestId] = { 
    id: requestId,
    api: route.api, 
    route: route, 
    ...(['post', 'patch', 'put'].includes(route.method) ? options : datas) 
  }

  RequestFunctions.cleanParametersRequest(requestId)
  return requestId
}

const set = (datas, requestId) => {
  for (const key in datas) {
    request[requestId][key] = datas[key]
  }
}

const get = (key, requestId) => {
  if(key === undefined) { return request }
  if(requestId === undefined) { return request[key] }    
  if(request[requestId] === undefined) { throw new Error(`Request ${requestId} not found`) }
  return utilsH.getNestedProperty(request[requestId], key)
}

const remove = requestId => {
  delete request[requestId]
}

const cleanParametersRequest = (requestId) => {
  const params = Request.get('params', requestId)

  for (const parameter_name in params) {
    if (params[parameter_name] === '') { delete params[parameter_name] }
  }

  Request.set({ params }, requestId)
}

export const Request = {
  init, get, set, remove
}

let reqCounter = 0; 
const LENGTH = 36;
const generateRequestId = () => {
  return (reqCounter++).toString(LENGTH)
}


export const RequestFunctions = {
    cleanParametersRequest,
    generateRequestId
}