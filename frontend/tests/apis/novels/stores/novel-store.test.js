import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'

describe('novel-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createNovelStore()
    const storeB = createNovelStore()

    storeA.setNovels([{ id: 1 }])

    expect(storeB.novels.value).toEqual([])
  })

  it('setNovels replaces the novels list', () => {
    const store = createNovelStore()

    store.setNovels([{ id: 1 }, { id: 2 }])

    expect(store.novels.value).toHaveLength(2)
  })

  it('setLoading toggles the loading flag', () => {
    const store = createNovelStore()

    store.setLoading(true)

    expect(store.isLoading.value).toBe(true)
  })

  it('setSelectedNovel stores the current novel', () => {
    const store = createNovelStore()

    store.setSelectedNovel({ id: 9, title: 'X' })

    expect(store.selectedNovel.value).toEqual({ id: 9, title: 'X' })
  })

  it('setCurrentChapter stores the current chapter', () => {
    const store = createNovelStore()

    store.setCurrentChapter({ id: 3 })

    expect(store.currentChapter.value).toEqual({ id: 3 })
  })

  it('clearSelectedNovel resets selected novel and current chapter', () => {
    const store = createNovelStore()
    store.setSelectedNovel({ id: 9 })
    store.setCurrentChapter({ id: 3 })

    store.clearSelectedNovel()

    expect(store.selectedNovel.value).toBeUndefined()
    expect(store.currentChapter.value).toBeUndefined()
  })

  it('exposes novels as a readonly ref (external mutation is ignored)', () => {
    const store = createNovelStore()
    store.setNovels([{ id: 1 }])

    store.novels.value = ['mutated']

    expect(store.novels.value).toEqual([{ id: 1 }])
  })
})
