/* eslint-disable no-console */
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { req } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { LogDto } from '@brugmann/vuemann/src/services/log/src/log-dto.js'
import { LogFunction } from '@brugmann/vuemann/src/services/log/src/log-function.js'

const send = async (error, context = {}) => {
  if (!LogFunction.isLoggingEnabled()) {
    return
  }

  if (!servicesM.service('router:hasApiRoute', 'log')) {
    logService.error(error, context)
    logService.error('La route "log" n\'est pas configurée pour les API routes')
    return
  }

  await req('log', {
    body: LogDto.toCreate(error, context),
    log: false,
  })
}

const error = (message, ...arguments_) => {
  console.error('[Error]', message, ...arguments_)
}

const warn = (message, ...arguments_) => {
  console.warn('[Warning]', message, ...arguments_)
}

const info = (message, ...arguments_) => {
  console.info('[Info]', message, ...arguments_)
}

const debug = (message, ...arguments_) => {
  console.debug('[Debug]', message, ...arguments_)
}

/** @type {import('@brugmann/vuemann/src/contracts/log-contract.js').LogService} */
export const logService = {
  send,
  error,
  warn,
  info,
  debug,
}
