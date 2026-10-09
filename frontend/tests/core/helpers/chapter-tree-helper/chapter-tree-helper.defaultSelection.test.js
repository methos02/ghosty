import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('defaultSelection', () => {
    it('opens on the main branch when the novel has one', () => {
      const tree = chapterSeeder.getForkedTree()

      expect(chapterTreeHelper.defaultSelection(tree.chapters, tree.mainBranchIds)).toEqual([
        10, 11, 13,
      ])
    })

    it('falls back to the root when no branch stands out', () => {
      expect(
        chapterTreeHelper.defaultSelection(chapterSeeder.getForkedTree().chapters, []),
      ).toEqual([10])
    })

    it('selects nothing when the novel has no published chapter', () => {
      expect(chapterTreeHelper.defaultSelection([], [])).toEqual([])
    })
  })
})
