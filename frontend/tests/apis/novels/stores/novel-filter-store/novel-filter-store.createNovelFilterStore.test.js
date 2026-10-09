import { describe, it, expect } from 'vitest'
import { createNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'

describe('novel-filter-store', () => {
  describe('createNovelFilterStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createNovelFilterStore()
      const storeB = createNovelFilterStore()

      storeA.setSearch('virage')

      expect(storeB.search.value).toBe('')
    })
  })
})
