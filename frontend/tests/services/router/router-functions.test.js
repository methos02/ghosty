import { describe, it, expect } from 'vitest'
import { routerFunctions } from '@/services/router/src/router-functions.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('router-functions', () => {
  describe('afterEach', () => {
    it('sets the document title to the app title when the route has no title', () => {
      routerFunctions.afterEach({ meta: {} })

      expect(document.title).toBe(ConfigLoader.get('app.title'))
    })

    it('prefixes the document title with the route title when present', () => {
      routerFunctions.afterEach({ meta: { title: 'novels.title' } })

      expect(document.title).toBe(`${t('novels.title')} - ${ConfigLoader.get('app.title')}`)
    })
  })

  describe('beforeEach', () => {
    it('always allows the error route', async () => {
      expect(await routerFunctions.beforeEach({ name: 'error', path: '/error', meta: {} })).toBe(
        true,
      )
    })

    it('allows a route without role restrictions', async () => {
      expect(await routerFunctions.beforeEach({ name: 'home', path: '/', meta: {} })).toBe(true)
    })
  })
})
