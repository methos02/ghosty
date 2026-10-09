import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('createChapterStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createChapterStore()
      const storeB = createChapterStore()

      storeA.setMainBranch(chapterSeeder.getMainBranch(2))

      expect(storeB.mainBranch.value).toEqual([])
    })
  })
})
