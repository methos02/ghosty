import { servicesM } from '@/services/services-manager.js'
import { servicesStores } from '@/services/services-stores.js'
import { registerServiceRoutes } from '@/services/services-routes-registry.js'

import { authService } from '@/services/auth/auth-service.js'
import { localeService } from '@/services/locale/locale-service.js'
import { ajaxService } from '@/services/ajax/ajax-service.js'
import { formService } from '@/services/form/form-service.js'
import { routerService } from '@/services/router/router-service.js'
import { utilsService } from '@/services/utils/utils-service.js'

import { useFlashStore } from '@/services/flash/src/flash-store.js'
import { useFormStore } from '@/services/form/src/form-store.js'
import { useLocaleStore } from '@/services/locale/src/locale-store.js'
import { useRouterStore } from '@/services/router/src/router-store.js'
import { useUtilsStore } from '@/services/utils/src/utils-store.js'
import { utilsRoutes } from '@/services/utils/src/utils-routes.js'

const state = {
  booted: false,
}

const bootServicesOnce = () => {
  if (state.booted) {
    return
  }

  servicesBootInternal.registerServices()
  state.booted = true
}

export const servicesBoot = {
  bootServicesOnce,
}

const registerServices = () => {
  servicesM.register('auth', authService)
  servicesM.register('locale', localeService)
  servicesM.register('ajax', ajaxService)
  servicesM.register('form', formService)
  servicesM.register('router', routerService)
  servicesM.register('utils', utilsService)

  servicesStores.register('flash', useFlashStore())
  servicesStores.register('form', useFormStore())
  servicesStores.register('locale', useLocaleStore())
  servicesStores.register('router', useRouterStore())
  servicesStores.register('utils', useUtilsStore())

  registerServiceRoutes('utils', utilsRoutes)
}

export const servicesBootInternal = {
  registerServices,
}
