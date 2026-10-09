import { describe, it, expect } from 'vitest'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('tree-store', () => {
  describe('setTree', () => {
    it('setTree stores the chapters and the main branch', () => {
      const store = createTreeStore()
      const tree = chapterSeeder.getTree()

      store.setTree(tree)

      expect(store.chapters.value).toEqual(tree.chapters)
      expect(store.mainBranchIds.value).toEqual(tree.mainBranchIds)
    })
  })
})
