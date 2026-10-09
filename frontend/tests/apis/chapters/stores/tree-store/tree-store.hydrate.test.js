import { describe, it, expect } from 'vitest'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('tree-store', () => {
  describe('hydrate', () => {
    it('hydrate restores what serialize produced', () => {
      const source = createTreeStore()
      source.setTree(chapterSeeder.getTree())
      const target = createTreeStore()

      target.hydrate(source.serialize())

      expect(target.chapters.value).toEqual(source.chapters.value)
      expect(target.mainBranchIds.value).toEqual(source.mainBranchIds.value)
    })
  })
})
