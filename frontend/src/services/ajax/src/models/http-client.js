import { Request } from "@/services/ajax/src/models/request.js";
import { requestInterceptor } from "@/services/ajax/src/models/request-interceptor.js";
import { responseErrorInterceptor } from "@/services/ajax/src/models/response-error-interceptor.js";

let client;
const init = axios => {
  httpClient.set(axios.create())
  client.interceptors.request.use(requestInterceptor)
  client.interceptors.response.use(undefined, responseErrorInterceptor)

  return client
}

const get = async requestId => { 
  const url = Request.get('url', requestId)
  return await client.get(url, {
    params : Request.get('params', requestId),
    requestId,
    paramsSerializer: httpClient.customParamsSerializer
  })
}

const post = async (requestId) => {
  const url = Request.get('url', requestId)
  const body = Request.get('body', requestId) ?? {}
  return await client.post(url, body, { requestId, params : Request.get('params', requestId) })
}

const put = async (requestId) => {
  const url = Request.get('url', requestId)
  const body = Request.get('body', requestId) ?? {}
  return await client.put(url, body, { requestId, params : Request.get('params', requestId) })
}

const patch = async (requestId) => {
  const url = Request.get('url', requestId)
  const body = Request.get('body', requestId) ?? {}
  return await client.patch(url, body, { requestId, params : Request.get('params', requestId) })
}
const deleteReq = async requestId => {
  const url = Request.get('url', requestId)
  return await client.delete(url, { requestId, params : Request.get('params', requestId) })
}

const set = clientInstance => {
  client = clientInstance
}
const getClient = () => {
  return client
}

const isDefine = () => {
  return client !== undefined
}

const customParamsSerializer = (params) => {
  const parts = [];
  for (const key in params) {
    if(params[key] === undefined) { continue }

    if (Array.isArray(params[key])) {
      for (const value of params[key]) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }

      continue
    } 
      
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  }
  return parts.join('&');
}

export const httpClient = { init, getClient, isDefine, get, post, put, patch, delete : deleteReq, set, customParamsSerializer } 
