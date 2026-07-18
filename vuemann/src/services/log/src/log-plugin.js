import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { logService } from '@brugmann/vuemann/src/services/log/log-service.js'
import { LogFunction } from '@brugmann/vuemann/src/services/log/src/log-function.js'
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'

export const logPlugin = () => ({
  install(app) {
    if (!LogFunction.isLoggingEnabled()) {
      return
    }

    app.config.errorHandler = async (error, _vm, info) => {
      // eslint-disable-next-line no-console
      console.error('Erreur VueJS détectée :', error, info)

      const { needUpdate } = useUtilsStore()
      const appVersion = ConfigLoader.get('app.version')
      needUpdate.value = await servicesM.service('utils:needUpdate', appVersion)

      if (needUpdate.value) {
        return
      }

      logService.send(error, { version: appVersion, info })
    }
  },
})
