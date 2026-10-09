import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('retraceBranch', () => {
    it('retraces the branch that leads to a chapter', () => {
      expect(chapterTreeHelper.retraceBranch(chapterSeeder.getForkedTree().chapters, 13)).toEqual([
        10, 11, 13,
      ])
    })

    it('retraces nothing for a chapter the loaded slice does not hold', () => {
      expect(chapterTreeHelper.retraceBranch(chapterSeeder.getForkedTree().chapters, 99)).toEqual(
        [],
      )
    })
  })
})
