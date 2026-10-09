import { describe, it, expect } from 'vitest'
import { correctionHelper } from '@/core/helpers/correction-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('correction-helper', () => {
  describe('isCorrectableBy', () => {
    it('opens the correction to the author while the window is still open', () => {
      const chapter = chapterSeeder.getChapter({ isCorrectable: true, author: { id: 7 } })

      expect(correctionHelper.isCorrectableBy(chapter, 7)).toBe(true)
    })

    it('closes it to everyone but the author', () => {
      const chapter = chapterSeeder.getChapter({ isCorrectable: true, author: { id: 7 } })

      expect(correctionHelper.isCorrectableBy(chapter, 8)).toBe(false)
    })

    it('closes it to the author once the window is over', () => {
      const chapter = chapterSeeder.getChapter({ isCorrectable: false, author: { id: 7 } })

      expect(correctionHelper.isCorrectableBy(chapter, 7)).toBe(false)
    })
  })
})
