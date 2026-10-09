import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-store', () => {
  describe('createNovelStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createNovelStore()
      const storeB = createNovelStore()

      storeA.addNovels(novelSeeder.getNovels(2))

      expect(storeB.novels.value).toEqual([])
    })
  })
})
