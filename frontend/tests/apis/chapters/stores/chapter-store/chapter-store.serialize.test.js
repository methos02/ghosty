import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('serialize', () => {
    it('serialize exposes the state for the ssr payload', () => {
      const store = createChapterStore()
      const branch = chapterSeeder.getMainBranch(2)
      store.setMainBranch(branch)

      expect(store.serialize()).toEqual({ mainBranch: branch, currentChapter: undefined })
    })
  })
})
