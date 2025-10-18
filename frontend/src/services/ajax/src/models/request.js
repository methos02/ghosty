let request = {};

const set = (route, datas, options) => {
    request = { api: route.api, route: route.name, ...(['post', 'patch', 'put'].includes(route.method) ? options : datas) }
    RequestFunctions.cleanParametersRequest()
    return request
}

const get = key => {
    if(key !== undefined) { return request[key] }
    return request
}

const cleanParametersRequest = () => {
  for (const parameter_name in Request.get('params')) {
    if (Request.get('params')[parameter_name] === '') { delete Request.get('params')[parameter_name] }
  }
}

export const Request = {
    set, get
}

export const RequestFunctions = {
    cleanParametersRequest
}
