import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createChapterStore()
    const storeB = createChapterStore()

    storeA.setCurrentBranch(chapterSeeder.getCurrentBranch(2))

    expect(storeB.currentBranch.value).toEqual([])
  })

  it('setCurrentBranch replaces the branch', () => {
    const store = createChapterStore()

    store.setCurrentBranch(chapterSeeder.getCurrentBranch(3))

    expect(store.currentBranch.value).toHaveLength(3)
  })

  it('setCurrentChapter stores the chapter being read', () => {
    const store = createChapterStore()
    const chapter = chapterSeeder.getChapter()

    store.setCurrentChapter(chapter)

    expect(store.currentChapter.value).toEqual(chapter)
  })

  it('clearCurrentChapter resets only the chapter being read', () => {
    const store = createChapterStore()
    store.setCurrentBranch(chapterSeeder.getCurrentBranch(2))
    store.setCurrentChapter(chapterSeeder.getChapter())

    store.clearCurrentChapter()

    expect(store.currentChapter.value).toBeUndefined()
    expect(store.currentBranch.value).toHaveLength(2)
  })

  it('clear resets the whole store', () => {
    const store = createChapterStore()
    store.setCurrentBranch(chapterSeeder.getCurrentBranch(2))
    store.setCurrentChapter(chapterSeeder.getChapter())

    store.clear()

    expect(store.currentBranch.value).toEqual([])
    expect(store.currentChapter.value).toBeUndefined()
  })

  it('serialize exposes the state for the ssr payload', () => {
    const store = createChapterStore()
    const branch = chapterSeeder.getCurrentBranch(2)
    store.setCurrentBranch(branch)

    expect(store.serialize()).toEqual({ currentBranch: branch, currentChapter: undefined })
  })

  it('hydrate restores a serialized state', () => {
    const store = createChapterStore()
    const branch = chapterSeeder.getCurrentBranch(2)

    store.hydrate({ currentBranch: branch, currentChapter: branch[0] })

    expect(store.currentBranch.value).toEqual(branch)
    expect(store.currentChapter.value).toEqual(branch[0])
  })

  it('hydrate ignores an empty payload', () => {
    const store = createChapterStore()

    store.hydrate(undefined)

    expect(store.currentBranch.value).toEqual([])
  })
})
