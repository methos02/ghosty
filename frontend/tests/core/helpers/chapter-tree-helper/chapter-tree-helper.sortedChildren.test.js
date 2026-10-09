import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('sortedChildren', () => {
    it('puts the most supported suite of a fork first', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(chapterTreeHelper.sortedChildren(chapters, 10).map(suite => suite.id)).toEqual([
        11, 12,
      ])
    })

    it('returns nothing for a chapter nobody has continued', () => {
      expect(chapterTreeHelper.sortedChildren(chapterSeeder.getForkedTree().chapters, 13)).toEqual(
        [],
      )
    })
  })
})
