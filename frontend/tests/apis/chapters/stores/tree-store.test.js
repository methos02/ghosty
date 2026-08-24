import { describe, it, expect } from 'vitest'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('tree-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createTreeStore()
    const storeB = createTreeStore()

    storeA.setTree(chapterSeeder.getTree())

    expect(storeB.chapters.value).toEqual([])
  })

  it('setTree stores the chapters and the current branch', () => {
    const store = createTreeStore()
    const tree = chapterSeeder.getTree()

    store.setTree(tree)

    expect(store.chapters.value).toEqual(tree.chapters)
    expect(store.currentBranchIds.value).toEqual(tree.currentBranchIds)
  })

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

  it('hydrate restores what serialize produced', () => {
    const source = createTreeStore()
    source.setTree(chapterSeeder.getTree())
    const target = createTreeStore()

    target.hydrate(source.serialize())

    expect(target.chapters.value).toEqual(source.chapters.value)
    expect(target.currentBranchIds.value).toEqual(source.currentBranchIds.value)
  })
})
