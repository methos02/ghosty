import { describe, it, expect } from 'vitest'
import { storeRegistry } from '@/ssr/store-registry.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('store-registry', () => {
  describe('createStores', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const firstVisitor = storeRegistry.createStores()
      const secondVisitor = storeRegistry.createStores()

      firstVisitor.novel.setSelectedNovel(novelSeeder.getNovel())

      expect(secondVisitor.novel.selectedNovel.value).toBeUndefined()
    })
  })
})
