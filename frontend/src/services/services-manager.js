import { log } from '@/services/shortcuts/log-shortcut.js'

const MAX_PARTS = 2

const state = {
  services: {},
}

const getServices = () => Object.keys(state.services)

const hasService = serviceName => {
  return state.services[internals.formatServiceName(serviceName)] !== undefined
}

const register = (serviceName, serviceMethods) => {
  state.services[internals.formatServiceName(serviceName)] = serviceMethods
}

const resetServices = () => {
  state.services = {}
}

const service = (serviceKey, methodParams) => {
  const [serviceName, serviceMethod] = serviceKey.split(':', MAX_PARTS)
  const method = internals.serviceMethod(serviceName, serviceMethod)
  const formattedParams = internals.formatMethodParams(methodParams)

  if (method === undefined) {
    return internals.serviceDefault(serviceName, serviceMethod, formattedParams)
  }

  return formattedParams === false ? method() : method(...formattedParams)
}

export const servicesM = {
  getServices,
  hasService,
  register,
  resetServices,
  service,
}

const formatMethodParams = methodParams => {
  if (methodParams === undefined) {
    return false
  }
  return Array.isArray(methodParams) ? methodParams : [methodParams]
}

const formatServiceName = serviceName => {
  return serviceName.endsWith('Service') ? serviceName : serviceName + 'Service'
}

const serviceDefault = (serviceName, serviceMethod, methodParams) => {
  if (servicesDefault[serviceName] === undefined) {
    return log.error(`default service ${serviceName} est inconnu`)
  }

  if (servicesDefault[serviceName][serviceMethod] === undefined) {
    return log.error(`default service ${serviceName} n'a pas la méthode ${serviceMethod}`)
  }

  return methodParams === false
    ? servicesDefault[serviceName][serviceMethod]()
    : servicesDefault[serviceName][serviceMethod](...methodParams)
}

const serviceError = serviceName => {
  log.error(`service ${serviceName} inconnu`, { services: servicesM.getServices() })
}

const serviceMethod = (serviceName, methodName) => {
  const formattedName = internals.formatServiceName(serviceName)

  if (state.services[formattedName] === undefined) {
    return internals.serviceError(formattedName)
  }

  if (state.services[formattedName][methodName] === undefined) {
    return log.error(`méthode ${methodName} inconnue dans le service ${formattedName}`)
  }

  return state.services[formattedName][methodName]
}

export const internals = {
  formatMethodParams,
  formatServiceName,
  serviceDefault,
  serviceError,
  serviceMethod,
}

export const servicesDefault = {
  locale: { t: textKey => textKey },
  flash: {
    success: message => log.info(message),
    error: message => log.error(message),
  },
}
