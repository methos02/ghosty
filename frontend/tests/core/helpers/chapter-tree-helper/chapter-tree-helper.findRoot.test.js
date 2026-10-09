import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-tree-helper', () => {
  describe('findRoot', () => {
    it('returns nothing when no chapter is published', () => {
      expect(chapterTreeHelper.findRoot([])).toBeUndefined()
    })

    it('takes the chapter whose parent is out of the loaded slice as the root', () => {
      const chapters = chapterSeeder.getForkedTree().chapters

      expect(chapterTreeHelper.findRoot(chapters).id).toBe(10)
    })
  })
})
