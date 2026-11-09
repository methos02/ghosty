import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-store', () => {
  describe('clearSelectedNovel', () => {
    it('clearSelectedNovel drops the opened novel', () => {
      const store = createNovelStore()
      store.setSelectedNovel(novelSeeder.getNovel())

      store.clearSelectedNovel()

      expect(store.selectedNovel.value).toBeUndefined()
    })
  })
})
