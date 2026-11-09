import { describe, it, expect, afterEach, vi } from 'vitest'
import { routerFunctions } from '@/services/router/src/router-functions.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('router-functions', () => {
  describe('beforeEach', () => {
    afterEach(() => {
      vi.clearAllMocks()
      useAuthStore().clear()
    })

    it('always allows the error route', async () => {
      expect(await routerFunctions.beforeEach({ name: 'error', path: '/error', meta: {} })).toBe(
        true,
      )
    })

    it('allows a route without role restrictions', async () => {
      expect(await routerFunctions.beforeEach({ name: 'home', path: '/', meta: {} })).toBe(true)
    })

    it('allows a signed-in user holding one of the required roles', async () => {
      useAuthStore().setUser(userSeeder.getUser({ roles: ['reader', 'moderator'] }))

      const result = await routerFunctions.beforeEach({
        name: 'moderation',
        path: '/moderation',
        meta: {
          requiresAuth: true,
          roles: ['moderator', 'admin'],
        },
      })

      expect(result).toBe(true)
    })

    it('sends a signed-in user without the required role back home', async () => {
      useAuthStore().setUser(userSeeder.getUser({ roles: ['reader'] }))

      const result = await routerFunctions.beforeEach({
        name: 'moderation',
        path: '/moderation',
        meta: {
          requiresAuth: true,
          roles: ['moderator', 'admin'],
        },
      })

      expect(result).toBe('/')
    })
  })
})
