import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('setChapterLike', () => {
    it('setChapterLike applies the support the api recorded on the chapter being read', () => {
      const store = createReadingStore()
      const reading = chapterSeeder.getReading()
      store.setReading(reading)

      store.setChapterLike(reading.chapter.id, { isLiked: true, likeCount: 42 })

      expect(store.chapter.value.isLiked).toBe(true)
      expect(store.chapter.value.likeCount).toBe(42)
      expect(store.chapter.value.title).toBe(reading.chapter.title)
    })

    it('setChapterLike ignores a support that answers for a chapter left behind', () => {
      const store = createReadingStore()
      const reading = chapterSeeder.getReading()
      store.setReading(reading)

      store.setChapterLike(reading.chapter.id + 1, { isLiked: true, likeCount: 99 })

      expect(store.chapter.value).toEqual(reading.chapter)
    })
  })
})
