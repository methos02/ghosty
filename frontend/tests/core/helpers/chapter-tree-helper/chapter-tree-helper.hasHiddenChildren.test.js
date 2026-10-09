import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('hasHiddenChildren', () => {
    it('reports the suites the loaded slice stops short of', () => {
      const chapters = [chapterSeeder.getChapter({ id: 10, childrenCount: 3 })]

      expect(chapterTreeHelper.hasHiddenChildren(chapters, 10)).toBe(true)
    })

    it('reports nothing to load when every suite is already there', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(chapterTreeHelper.hasHiddenChildren(chapters, 10)).toBe(false)
    })

    it('reports nothing to load for a chapter out of the loaded slice', () => {
      expect(chapterTreeHelper.hasHiddenChildren([], 10)).toBe(false)
    })
  })
})
