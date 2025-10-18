import { Request } from "./request.js";
import { requestInterceptor } from "./request-interceptor.js";
import { responseErrorInterceptor } from "./response-error-interceptor.js";

let client;
const init = axios => {
  httpClient.set(axios.create())
  client.interceptors.request.use(requestInterceptor)
  client.interceptors.response.use(undefined, responseErrorInterceptor)

  return client
}

const get = async url => { 
  return await client.get(url, {
    params : Request.get('params'),
    paramsSerializer: httpClient.customParamsSerializer
  })
}

const post = async (url, data = {}) => {
  return await client.post(url, data)
}

const put = async (url, data = {}) => {
  return await client.put(url, data)
}

const patch = async (url, data = {}) => {
  return await client.patch(url, data, Request.get())

}
const deleteReq = async url => {
  return await client.delete(url, Request.get())
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