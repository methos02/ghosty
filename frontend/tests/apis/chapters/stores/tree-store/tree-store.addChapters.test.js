import { describe, it, expect } from 'vitest'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('tree-store', () => {
  describe('addChapters', () => {
    it('addChapters appends a branch loaded on demand', () => {
      const store = createTreeStore()
      store.setTree(chapterSeeder.getTree())

      store.addChapters([chapterSeeder.getChapter({ id: 99, parentId: 12 })])

      expect(store.chapters.value.at(-1).id).toBe(99)
    })

    it('addChapters ignores a chapter the tree already holds', () => {
      const store = createTreeStore()
      const tree = chapterSeeder.getTree()
      store.setTree(tree)

      store.addChapters(tree.chapters)

      expect(store.chapters.value).toHaveLength(tree.chapters.length)
    })
  })
})
