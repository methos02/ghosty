import './assets/scss/vuemann.scss'

import App from './App.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { app as appConfig} from '@brugmann/vuemann/src/config/app-config.js'
import { routes } from '@brugmann/vuemann/src/config/route-config.js'
import { routesApi } from '@brugmann/vuemann/src/config/routes-api-config.js'
import { auth } from '@brugmann/vuemann/src/config/auth-config.js'

import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from './config/config-loader.js'
import { ajaxInit } from './services/ajax/ajax-init.js'
import { localeInit } from './services/locale/locale-init.js'
import { utilsInit } from './services/utils/utils-init.js'
import { authInit } from './services/auth/auth-init.js'
import { flashInit } from './services/flash/flash-init.js'
import { formInit } from './services/form/form-init.js'
import { routerInit } from './services/router/router-init.js'

ConfigLoader.init({routes, app: appConfig, routesApi, auth})

const app = createApp(App)
app.provide('appVersion', __APP_VERSION__)
app.use(createPinia())

await servicesM.initServices(app, {
  ajax : ajaxInit,
  locale : localeInit,
  utils : utilsInit,
  auth : authInit,
  flash : flashInit,
  form : formInit,
  router : routerInit,
})

app.mount('#app')
