import { describe, it, expect, afterEach } from 'vitest'
import { createApp } from '@/ssr/app.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('app', () => {
  describe('createApp', () => {
    afterEach(() => {
      globalThis.history.replaceState({}, '', '/')
    })

    it('restores the signed-in reader before the first navigation reaches a protected page', async () => {
      globalThis.history.replaceState({}, '', '/me/drafts')

      const { router, stores } = await createApp({
        initialState: { auth: { user: userSeeder.getUser() } },
      })
      await router.isReady()

      expect(stores.auth.isAuthenticated.value).toBe(true)
      expect(router.currentRoute.value.name).toBe('drafts')
    })
  })
})
