import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-store', () => {
  describe('reset', () => {
    it('reset empties the grid and rewinds the pagination', () => {
      const store = createNovelStore()
      store.addNovels(novelSeeder.getNovels(2))
      store.setPagination(paginationSeeder.getPagination())

      store.reset()

      expect(store.novels.value).toEqual([])
      expect(store.pagination.value).toEqual({ nextPage: 1, lastPage: 1 })
    })
  })
})
