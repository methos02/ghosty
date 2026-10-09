import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('selectedChapters', () => {
    it('ignores the ids the loaded slice does not hold yet', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(
        chapterTreeHelper.selectedChapters(chapters, [10, 99, 11]).map(chapter => chapter.id),
      ).toEqual([10, 11])
    })
  })
})
