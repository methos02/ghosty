import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-store', () => {
  describe('addNovels', () => {
    it('appends the loaded novels instead of replacing them', () => {
      const store = createNovelStore()

      store.addNovels(novelSeeder.getNovels(2))
      store.addNovels(novelSeeder.getNovels(1))

      expect(store.novels.value).toHaveLength(3)
    })
  })
})
