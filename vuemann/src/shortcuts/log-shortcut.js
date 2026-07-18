import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

export const log = {
  debug: (message, ...arguments_) => servicesM.service('log:debug', [message, ...arguments_]),
  error: (message, ...arguments_) => servicesM.service('log:error', [message, ...arguments_]),
  info: (message, ...arguments_) => servicesM.service('log:info', [message, ...arguments_]),
  send: (error, context) => servicesM.service('log:send', [error, context]),
  warn: (message, ...arguments_) => servicesM.service('log:warn', [message, ...arguments_]),
}
