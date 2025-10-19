import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/app.scss'
import { ajaxInit } from './services/ajax/ajax-init.js'
import { localeInit } from './services/locale/locale-init.js'
import { servicesM } from './services/services-manager.js'
import { utilsInit } from './services/utils/utils-init.js'
import { flashInit } from './services/flash/flash-init.js'
import { formInit } from './services/form/form-init.js'
import { routerInit } from './services/router/router-init.js'
const app = createApp(App)

await servicesM.initServices(app, {
  locale: localeInit,
  ajax: ajaxInit,
  utils: utilsInit,
  flash: flashInit,
  form: formInit,
  router: routerInit
})

app.mount('#app')