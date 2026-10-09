import { describe, it, expect } from 'vitest'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('tree-store', () => {
  describe('createTreeStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createTreeStore()
      const storeB = createTreeStore()

      storeA.setTree(chapterSeeder.getTree())

      expect(storeB.chapters.value).toEqual([])
    })
  })
})
