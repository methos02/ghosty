import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/app.scss'
import { servicesInit } from '@/services/services-init.js'
import { BOOT_STATUS } from '@/constants/boot-status.js'
import { authInit } from '@/services/auth/auth-init.js'
import { localeInit } from '@/services/locale/locale-init.js'
import { ajaxInit } from '@/services/ajax/ajax-init.js'
import { flashInit } from '@/services/flash/flash-init.js'
import { formInit } from '@/services/form/form-init.js'
import { routerInit } from '@/services/router/router-init.js'
import { utilsInit } from '@/services/utils/utils-init.js'

const app = createApp(App)

const boot = await servicesInit.initServices(app, {
  auth: authInit,
  locale: localeInit,
  ajax: ajaxInit,
  flash: flashInit,
  form: formInit,
  router: routerInit,
  utils: utilsInit,
})

if (boot.status === BOOT_STATUS.SUCCESS) {
  app.mount('#app')
}
