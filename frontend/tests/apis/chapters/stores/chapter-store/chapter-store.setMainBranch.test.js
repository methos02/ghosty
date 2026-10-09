import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('setMainBranch', () => {
    it('setMainBranch replaces the branch', () => {
      const store = createChapterStore()

      store.setMainBranch(chapterSeeder.getMainBranch(3))

      expect(store.mainBranch.value).toHaveLength(3)
    })
  })
})
