import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/scss/app.scss'
import { routes } from './config/routes-config.js'
import { ajaxInit } from './services/ajax/ajax-init.js'
import { localeInit } from './services/locale/locale-init.js'
import { servicesM } from './services/services-manager.js'
import { utilsInit } from './services/utils/utils-init.js'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // Navigation guards
// router.beforeEach(async (to, _from, next) => {
//   const { useAuth } = await import('./composables/useAuth')
//   const { isAuthenticated, isAuthor } = useAuth()

//   if (to.meta.requiresAuth && !isAuthenticated.value) {
//     next({ name: 'login', query: { redirect: to.fullPath } })
//   } else if (to.meta.requiresAuthor && !isAuthor.value) {
//     next({ name: 'home' })
//   } else {
//     next()
//   }
// })

// Create app
const app = createApp(App)

// Initialiser les services de manière asynchrone
const initApp = async () => {
  await servicesM.initServices(app, {
    locale: localeInit,  // locale doit être initialisé en premier car ajax en dépend
    ajax: ajaxInit,
    utils: utilsInit,
    flash: flashInit,
    form: formInit,
    router: routerInit
  })
  
  app.use(router)
  app.mount('#app')
}

initApp()
