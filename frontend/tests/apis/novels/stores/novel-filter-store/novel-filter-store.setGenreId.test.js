import { describe, it, expect } from 'vitest'
import { createNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'

describe('novel-filter-store', () => {
  describe('setGenreId', () => {
    it('keeps the term and the genre independent from each other', () => {
      const store = createNovelFilterStore()

      store.setSearch('virage')
      store.setGenreId(3)

      expect(store.serialize()).toEqual({ search: 'virage', genreId: 3 })
    })
  })
})
