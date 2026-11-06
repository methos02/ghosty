import { describe, it, expect } from 'vitest'
import { storeRegistry } from '@/ssr/store-registry.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('store-registry', () => {
  describe('hydrateStores', () => {
    it('restores in the browser the stores serialized by the server', () => {
      const serverStores = storeRegistry.createStores()
      serverStores.auth.setUser(userSeeder.getUser())
      serverStores.novel.setSelectedNovel(novelSeeder.getNovel())
      const browserStores = storeRegistry.createStores()

      storeRegistry.hydrateStores(browserStores, storeRegistry.serializeStores(serverStores))

      expect(storeRegistry.serializeStores(browserStores)).toEqual(
        storeRegistry.serializeStores(serverStores),
      )
    })

    it('leaves the stores empty when the server sent no state', () => {
      const stores = storeRegistry.createStores()

      storeRegistry.hydrateStores(stores, undefined)

      expect(storeRegistry.serializeStores(stores)).toEqual(
        storeRegistry.serializeStores(storeRegistry.createStores()),
      )
    })
  })
})
