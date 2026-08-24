import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('rootOf', () => {
    it('returns nothing when no chapter is published', () => {
      expect(chapterTreeHelper.rootOf([])).toBeUndefined()
    })

    it('takes the chapter whose parent is out of the loaded slice as the root', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(chapterTreeHelper.rootOf(chapters).id).toBe(10)
    })
  })

  describe('childrenOf', () => {
    it('puts the most supported suite of a fork first', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(chapterTreeHelper.childrenOf(chapters, 10).map(suite => suite.id)).toEqual([
        11, 12,
      ])
    })

    it('returns nothing for a chapter nobody has continued', () => {
      expect(chapterTreeHelper.childrenOf(chapterSeeder.getForkedTree().chapters, 13)).toEqual(
        [],
      )
    })
  })

  describe('selectedChapters', () => {
    it('ignores the ids the loaded slice does not hold yet', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(
        chapterTreeHelper.selectedChapters(chapters, [10, 99, 11]).map(chapter => chapter.id),
      ).toEqual([10, 11])
    })
  })

  describe('pathTo', () => {
    it('retraces the branch that leads to a chapter', () => {
      expect(chapterTreeHelper.pathTo(chapterSeeder.getForkedTree().chapters, 13)).toEqual([
        10, 11, 13,
      ])
    })

    it('retraces nothing for a chapter the loaded slice does not hold', () => {
      expect(chapterTreeHelper.pathTo(chapterSeeder.getForkedTree().chapters, 99)).toEqual([])
    })
  })

  describe('defaultSelection', () => {
    it('opens on the current branch when the novel has one', () => {
      const tree = chapterSeeder.getForkedTree()

      expect(chapterTreeHelper.defaultSelection(tree.chapters, tree.currentBranchIds)).toEqual([
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

  describe('selectionUpTo', () => {
    it('continues the branch with a chapter it does not hold yet', () => {
      expect(chapterTreeHelper.selectionUpTo([10, 11], 13)).toEqual([10, 11, 13])
    })

    it('drops what came after the chapter the reader comes back to', () => {
      expect(chapterTreeHelper.selectionUpTo([10, 11, 13], 11)).toEqual([10, 11])
    })
  })

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
