import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BranchBreadcrumb from '@/views/chapters/parts/BranchBreadcrumb.vue'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const breadcrumbProvide = ancestors => {
  const readingStore = createReadingStore()
  const novelStore = createNovelStore()
  readingStore.setReading({ ...chapterSeeder.getReading(), ancestors })
  novelStore.setSelectedNovel(novelSeeder.getNovel())

  return { [READING_STORE_KEY]: readingStore, [NOVEL_STORE_KEY]: novelStore }
}

describe('BranchBreadcrumb.vue', () => {
  it('retraces the thread the reader followed, without repeating the chapter everyone starts on', () => {
    const wrapper = mount(BranchBreadcrumb, {
      global: { provide: breadcrumbProvide(chapterSeeder.getCurrentBranch(3)) },
    })

    expect(wrapper.findAll('.branch-breadcrumb__ancestor').map(link => link.text())).toEqual([
      'Chapitre 2',
      'Chapitre 3',
    ])
  })

  it('stays out of the way when the first chapter is the only one behind', () => {
    const wrapper = mount(BranchBreadcrumb, {
      global: { provide: breadcrumbProvide([chapterSeeder.getChapter({ id: 10 })]) },
    })

    expect(wrapper.find('.branch-breadcrumb').exists()).toBe(false)
  })
})
