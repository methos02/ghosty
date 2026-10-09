import { describe, it, expect } from 'vitest'
import { routerFunctions } from '@/services/router/src/router-functions.js'

describe('router-functions', () => {
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
