import { describe, it, expect } from 'vitest'
import { createNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'

describe('novel-filter-store', () => {
  describe('hydrate', () => {
    it('restores the criteria from a snapshot', () => {
      const store = createNovelFilterStore()

      store.hydrate({ search: 'nuit', genreId: 7 })

      expect(store.search.value).toBe('nuit')
      expect(store.genreId.value).toBe(7)
    })
  })
})
