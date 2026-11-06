import { describe, it, expect, vi, afterEach } from 'vitest'
import { clientApp } from '@/ssr/client-app.js'
import { storeRegistry } from '@/ssr/store-registry.js'
import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'

describe('client-app', () => {
  describe('restoreSession', () => {
    afterEach(() => {
      document.cookie = 'ghosty_session=; max-age=0'
      useAuthStore().clear()
      vi.restoreAllMocks()
    })

    it('does not ask the api again for the reader restored by the server', async () => {
      document.cookie = 'ghosty_session=1'
      const me = vi.spyOn(AuthRepository, 'me')
      const stores = storeRegistry.createStores()
      stores.auth.setUser(userSeeder.getUser())

      await clientApp.restoreSession(stores)

      expect(me).not.toHaveBeenCalled()
    })

    it('asks the api for the reader when the server sent none', async () => {
      document.cookie = 'ghosty_session=1'
      vi.spyOn(AuthRepository, 'me').mockResolvedValue(
        controllerSuccess({ data: { user: userSeeder.getUserApi() } }),
      )

      await clientApp.restoreSession(storeRegistry.createStores())

      expect(useAuthStore().user.value).toEqual(userSeeder.getUser())
    })
  })
})
