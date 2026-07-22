import { describe, it, expect, beforeEach } from 'vitest'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'

describe('novel-store', () => {
  let store

  beforeEach(() => {
    store = useNovelStore()
    store.setNovels([])
    store.clearSelectedNovel()
    store.setLoading(false)
  })

  it('shares state across calls (singleton module state)', () => {
    const a = useNovelStore()
    const b = useNovelStore()

    a.setNovels([{ id: 1 }])

    expect(b.novels.value).toEqual([{ id: 1 }])
  })

  it('setNovels replaces the novels list', () => {
    store.setNovels([{ id: 1 }, { id: 2 }])

    expect(store.novels.value).toHaveLength(2)
  })

  it('setLoading toggles the loading flag', () => {
    store.setLoading(true)

    expect(store.isLoading.value).toBe(true)
  })

  it('setSelectedNovel stores the current novel', () => {
    store.setSelectedNovel({ id: 9, title: 'X' })

    expect(store.selectedNovel.value).toEqual({ id: 9, title: 'X' })
  })

  it('setCurrentChapter stores the current chapter', () => {
    store.setCurrentChapter({ id: 3 })

    expect(store.currentChapter.value).toEqual({ id: 3 })
  })

  it('clearSelectedNovel resets selected novel and current chapter', () => {
    store.setSelectedNovel({ id: 9 })
    store.setCurrentChapter({ id: 3 })

    store.clearSelectedNovel()

    expect(store.selectedNovel.value).toBeUndefined()
    expect(store.currentChapter.value).toBeUndefined()
  })

  it('exposes novels as a readonly ref (external mutation is ignored)', () => {
    store.setNovels([{ id: 1 }])

    store.novels.value = ['mutated']

    expect(store.novels.value).toEqual([{ id: 1 }])
  })
})
