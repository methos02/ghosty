import { logService } from './init/log-service.js'
import { logPlugin } from './init/log-plugin.js'

export const logInit = {
  dependencies: ['ajax'],
  services: logService,
  plugin: logPlugin
}
