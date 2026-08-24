import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createReadingStore()
    const storeB = createReadingStore()

    storeA.setReading(chapterSeeder.getReading())

    expect(storeB.chapter.value).toBeUndefined()
  })

  it('setReading stores the chapter with its thread and its children', () => {
    const store = createReadingStore()
    const reading = chapterSeeder.getReading()

    store.setReading(reading)

    expect(store.chapter.value).toEqual(reading.chapter)
    expect(store.ancestors.value).toEqual(reading.ancestors)
    expect(store.children.value).toEqual(reading.children)
    expect(store.nextChapterId.value).toBe(reading.nextChapterId)
  })

  it('clear empties the reading', () => {
    const store = createReadingStore()
    store.setReading(chapterSeeder.getReading())

    store.clear()

    expect(store.chapter.value).toBeUndefined()
    expect(store.ancestors.value).toEqual([])
    expect(store.children.value).toEqual([])
    expect(store.nextChapterId.value).toBeUndefined()
  })

  it('hydrate restores what serialize produced', () => {
    const source = createReadingStore()
    source.setReading(chapterSeeder.getReading())
    const target = createReadingStore()

    target.hydrate(source.serialize())

    expect(target.chapter.value).toEqual(source.chapter.value)
    expect(target.nextChapterId.value).toBe(source.nextChapterId.value)
  })
})
