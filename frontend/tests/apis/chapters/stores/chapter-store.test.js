import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createChapterStore()
    const storeB = createChapterStore()

    storeA.setCurrentContinuity(chapterSeeder.getCurrentContinuity(2))

    expect(storeB.currentContinuity.value).toEqual([])
  })

  it('setCurrentContinuity replaces the continuity', () => {
    const store = createChapterStore()

    store.setCurrentContinuity(chapterSeeder.getCurrentContinuity(3))

    expect(store.currentContinuity.value).toHaveLength(3)
  })

  it('setCurrentChapter stores the chapter being read', () => {
    const store = createChapterStore()
    const chapter = chapterSeeder.getChapter()

    store.setCurrentChapter(chapter)

    expect(store.currentChapter.value).toEqual(chapter)
  })

  it('clearCurrentChapter resets only the chapter being read', () => {
    const store = createChapterStore()
    store.setCurrentContinuity(chapterSeeder.getCurrentContinuity(2))
    store.setCurrentChapter(chapterSeeder.getChapter())

    store.clearCurrentChapter()

    expect(store.currentChapter.value).toBeUndefined()
    expect(store.currentContinuity.value).toHaveLength(2)
  })

  it('clear resets the whole store', () => {
    const store = createChapterStore()
    store.setCurrentContinuity(chapterSeeder.getCurrentContinuity(2))
    store.setCurrentChapter(chapterSeeder.getChapter())

    store.clear()

    expect(store.currentContinuity.value).toEqual([])
    expect(store.currentChapter.value).toBeUndefined()
  })

  it('serialize exposes the state for the ssr payload', () => {
    const store = createChapterStore()
    const continuity = chapterSeeder.getCurrentContinuity(2)
    store.setCurrentContinuity(continuity)

    expect(store.serialize()).toEqual({ currentContinuity: continuity, currentChapter: undefined })
  })

  it('hydrate restores a serialized state', () => {
    const store = createChapterStore()
    const continuity = chapterSeeder.getCurrentContinuity(2)

    store.hydrate({ currentContinuity: continuity, currentChapter: continuity[0] })

    expect(store.currentContinuity.value).toEqual(continuity)
    expect(store.currentChapter.value).toEqual(continuity[0])
  })

  it('hydrate ignores an empty payload', () => {
    const store = createChapterStore()

    store.hydrate(undefined)

    expect(store.currentContinuity.value).toEqual([])
  })
})
