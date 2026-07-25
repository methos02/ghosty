/**
 * Setup global des tests — référencé par `setupFiles` dans vitest.config.js.
 * Exécuté une fois AVANT chaque fichier de test.
 * Reconstitue l'environnement de main.js : APIs jsdom stubbées + services bootés.
 */
import { createApp } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { servicesInit } from '@/services/services-init.js'
import { authInit } from '@/services/auth/auth-init.js'
import { localeInit } from '@/services/locale/locale-init.js'
import { ajaxInit } from '@/services/ajax/ajax-init.js'
import { flashInit } from '@/services/flash/flash-init.js'
import { formInit } from '@/services/form/form-init.js'
import { routerInit } from '@/services/router/router-init.js'
import { utilsInit } from '@/services/utils/utils-init.js'
import { windowMock } from '&/utils/mocks/window-mock.js'
import { computedStyleMock } from '&/utils/mocks/computed-style-mock.js'
import { popoverMock } from '&/utils/mocks/popover-mock.js'
import { dialogMock } from '&/utils/mocks/dialog-mock.js'
import { configureTestUtils } from '&/utils/test-utils-config.js'

// 1. Stubs des APIs navigateur absentes de jsdom.
windowMock()
computedStyleMock()
popoverMock()
dialogMock()

// 2. Boot des services Ghosty (réplique main.js) — rend req / t / flash / form / ... disponibles.
const app = createApp({ name: 'test' })
await servicesInit.initServices(app, {
  auth: authInit,
  locale: localeInit,
  ajax: ajaxInit,
  flash: flashInit,
  form: formInit,
  router: routerInit,
  utils: utilsInit,
})

// 3. Config globale @vue/test-utils (route courante + stub <router-link>).
configureTestUtils()

await flushPromises()
