import '@brugmann/vuemann/src/assets/scss/vuemann.scss'

import App from '@brugmann/vuemann/src/App.vue'

import { createApp } from 'vue'

import { app as appConfig } from '@brugmann/vuemann/src/config/app-config.js'
import { routes } from '@brugmann/vuemann/src/config/route-config.js'
import { routesApi } from '@brugmann/vuemann/src/config/routes-api-config.js'
import { auth } from '@brugmann/vuemann/src/config/auth-config.js'

import { servicesInit } from '@brugmann/vuemann/src/services/services-init.js'
import { BOOT_STATUS } from '@brugmann/vuemann/src/constants/boot-status.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { ajaxInit } from '@brugmann/vuemann/src/services/ajax/ajax-init.js'
import { localeInit } from '@brugmann/vuemann/src/services/locale/locale-init.js'
import { utilsInit } from '@brugmann/vuemann/src/services/utils/utils-init.js'
import { authInit } from '@brugmann/vuemann/src/services/auth/auth-init.js'
import { flashInit } from '@brugmann/vuemann/src/services/flash/flash-init.js'
import { formInit } from '@brugmann/vuemann/src/services/form/form-init.js'
import { routerInit } from '@brugmann/vuemann/src/services/router/router-init.js'
import { logInit } from '@brugmann/vuemann/src/services/log/log-init.js'
import { tabsInit } from '@brugmann/vuemann/src/services/tabs/tabs-init.js'

ConfigLoader.init({
  routes,
  app: appConfig,
  routesApi,
  auth,
})

const app = createApp(App)
app.provide('appVersion', __APP_VERSION__)

const boot = await servicesInit.initServices(app, {
  ajax: ajaxInit,
  locale: localeInit,
  utils: utilsInit,
  auth: authInit,
  flash: flashInit,
  form: formInit,
  router: routerInit,
  log: logInit,
  tabs: tabsInit,
})

if (boot.status === BOOT_STATUS.SUCCESS) {
  app.mount('#app')
}
