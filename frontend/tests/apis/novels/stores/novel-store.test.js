import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createNovelStore()
    const storeB = createNovelStore()

    storeA.addNovels(novelSeeder.getNovels(2))

    expect(storeB.novels.value).toEqual([])
  })

  it('appends the loaded novels instead of replacing them', () => {
    const store = createNovelStore()

    store.addNovels(novelSeeder.getNovels(2))
    store.addNovels(novelSeeder.getNovels(1))

    expect(store.novels.value).toHaveLength(3)
  })

  it('reset empties the grid and rewinds the pagination', () => {
    const store = createNovelStore()
    store.addNovels(novelSeeder.getNovels(2))
    store.setPagination(paginationSeeder.getPagination())

    store.reset()

    expect(store.novels.value).toEqual([])
    expect(store.pagination.value).toEqual({ nextPage: 1, lastPage: 1 })
  })

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

  it('clearSelectedNovel drops the opened novel', () => {
    const store = createNovelStore()
    store.setSelectedNovel(novelSeeder.getNovel())

    store.clearSelectedNovel()

    expect(store.selectedNovel.value).toBeUndefined()
  })

  it('restores the grid and the opened novel from a snapshot', () => {
    const store = createNovelStore()
    const snapshot = {
      novels: novelSeeder.getNovels(2),
      pagination: paginationSeeder.getPagination(),
      selectedNovel: novelSeeder.getNovel(),
    }

    store.hydrate(snapshot)

    expect(store.serialize()).toEqual(snapshot)
  })
})
