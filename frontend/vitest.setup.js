/**
 * Setup global des tests — référencé par `setupFiles` dans vitest.config.js.
 * Exécuté une fois AVANT chaque fichier de test.
 * Reconstitue l'environnement de ssr/app.js : APIs jsdom stubbées + services bootés.
 */
import { createApp } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { servicesBoot } from '@/ssr/services-boot.js'
import { localePlugin } from '@/services/locale/src/locale-plugin.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { createAuthStore, setClientAuthStore } from '@/services/auth/src/auth-store.js'
import { windowMock } from '&/utils/mocks/window-mock.js'
import { computedStyleMock } from '&/utils/mocks/computed-style-mock.js'
import { popoverMock } from '&/utils/mocks/popover-mock.js'
import { dialogMock } from '&/utils/mocks/dialog-mock.js'
import { logMock } from '&/utils/mocks/log-mock.js'
import { configureTestUtils } from '&/utils/test-utils-config.js'

// 1. Stubs des APIs navigateur absentes de jsdom.
windowMock()
computedStyleMock()
popoverMock()
dialogMock()
logMock()

// 2. Boot des services Ghosty (réplique ssr/app.js) — rend req / t / flash / form / ... disponibles.
servicesBoot.bootServicesOnce()
setClientAuthStore(createAuthStore())

const app = createApp({ name: 'test' })
app.use(routerPlugin.createAppRouter({ ssr: true }))
app.use(await localePlugin())

// 3. Config globale @vue/test-utils (route courante + stub <router-link>).
configureTestUtils()

await flushPromises()
