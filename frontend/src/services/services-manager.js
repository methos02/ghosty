import { log } from '@/services/shortcuts/log-shortcut.js'

const MAX_PARTS = 2

const state = {
  services: {},
}

const getServices = () => Object.keys(state.services)

const hasService = serviceName => {
  return state.services[servicesManagerInternal.formatServiceName(serviceName)] !== undefined
}

const register = (serviceName, serviceMethods) => {
  state.services[servicesManagerInternal.formatServiceName(serviceName)] = serviceMethods
}

const resetServices = () => {
  state.services = {}
}

const service = (serviceKey, methodParams) => {
  const [serviceName, serviceMethod] = serviceKey.split(':', MAX_PARTS)
  const method = servicesManagerInternal.serviceMethod(serviceName, serviceMethod)
  const formattedParams = servicesManagerInternal.formatMethodParams(methodParams)

  if (method === undefined) {
    return servicesManagerInternal.serviceDefault(serviceName, serviceMethod, formattedParams)
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
  const formattedName = servicesManagerInternal.formatServiceName(serviceName)

  if (state.services[formattedName] === undefined) {
    return servicesManagerInternal.serviceError(formattedName)
  }

  if (state.services[formattedName][methodName] === undefined) {
    return log.error(`méthode ${methodName} inconnue dans le service ${formattedName}`)
  }

  return state.services[formattedName][methodName]
}

export const servicesManagerInternal = {
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
