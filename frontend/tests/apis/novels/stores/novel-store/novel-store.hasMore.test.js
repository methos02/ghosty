import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-store', () => {
  describe('hasMore', () => {
    it('has more while the next page is within the last one', () => {
      const store = createNovelStore()

      store.setPagination(paginationSeeder.getPagination({ nextPage: 3, lastPage: 3 }))

      expect(store.hasMore()).toBe(true)
    })

    it('has no more once the next page passed the last one', () => {
      const store = createNovelStore()

      store.setPagination(paginationSeeder.getPagination({ nextPage: 4, lastPage: 3 }))

      expect(store.hasMore()).toBe(false)
    })
  })
})
