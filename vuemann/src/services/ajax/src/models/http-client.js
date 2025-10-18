import { Request } from "@brugmann/vuemann/src/services/ajax/src/models/request.js";
import { requestInterceptor } from "@brugmann/vuemann/src/services/ajax/src/models/request-interceptor.js";
import { responseErrorInterceptor } from "@brugmann/vuemann/src/services/ajax/src/models/response-error-interceptor.js";

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

const post = async (requestId, data = {}) => {
  const url = Request.get('url', requestId)
  return await client.post(url, data, { requestId })
}

const put = async (requestId, data = {}) => {
  const url = Request.get('url', requestId)
  return await client.put(url, data, { requestId })
}

const patch = async (requestId, data = {}) => {
  const url = Request.get('url', requestId)
  return await client.patch(url, data, { requestId })

}
const deleteReq = async requestId => {
  const url = Request.get('url', requestId)
  return await client.delete(url, { requestId })
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
