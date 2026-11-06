import { describe, it, expect } from 'vitest'
import { storeRegistry } from '@/ssr/store-registry.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('store-registry', () => {
  describe('serializeStores', () => {
    it('gathers the state of each store under its name', () => {
      const stores = storeRegistry.createStores()
      const novel = novelSeeder.getNovel()
      stores.novel.setSelectedNovel(novel)

      const state = storeRegistry.serializeStores(stores)

      expect(state.novel).toEqual(stores.novel.serialize())
      expect(state.novel.selectedNovel).toEqual(novel)
    })
  })
})
