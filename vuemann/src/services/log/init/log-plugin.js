import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { logService } from './log-service.js'
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'

export const logPlugin = () => ({
  install(app) {
    if(import.meta.env[`VITE_ENV`] === 'dev') { return }

    app.config.errorHandler = async (error, vm, info) => {
      // eslint-disable-next-line no-console
      console.error('Erreur VueJS détectée :', error, info)

      const utilsStore = useUtilsStore()
      const appVersion = app._context?.provides?.appVersion
      utilsStore.needUpdate = await servicesM.service('utils:needUpdate', appVersion)

      logService.send(error, { version: appVersion, info })
    }
  }
})
