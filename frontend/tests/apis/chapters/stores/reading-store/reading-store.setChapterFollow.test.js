import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('setChapterFollow', () => {
    it('applies the follow state the api recorded on the chapter being read', () => {
      const store = createReadingStore()
      const reading = chapterSeeder.getReading()
      store.setReading(reading)

      store.setChapterFollow(reading.chapter.id, true)

      expect(store.chapter.value.isFollowed).toBe(true)
      expect(store.chapter.value.title).toBe(reading.chapter.title)
    })

    it('ignores a follow that answers for a chapter left behind', () => {
      const store = createReadingStore()
      const reading = chapterSeeder.getReading()
      store.setReading(reading)

      store.setChapterFollow(reading.chapter.id + 1, true)

      expect(store.chapter.value).toEqual(reading.chapter)
    })
  })
})
