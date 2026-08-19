import { describe, it, expect } from 'vitest'
import { createNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'

describe('novel-filter-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createNovelFilterStore()
    const storeB = createNovelFilterStore()

    storeA.setSearch('virage')

    expect(storeB.search.value).toBe('')
  })

  it('keeps the term and the genre independent from each other', () => {
    const store = createNovelFilterStore()

    store.setSearch('virage')
    store.setGenreId(3)

    expect(store.serialize()).toEqual({ search: 'virage', genreId: 3 })
  })

  it('restores the criteria from a snapshot', () => {
    const store = createNovelFilterStore()

    store.hydrate({ search: 'nuit', genreId: 7 })

    expect(store.search.value).toBe('nuit')
    expect(store.genreId.value).toBe(7)
  })
})
