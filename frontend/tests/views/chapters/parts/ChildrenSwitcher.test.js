import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { router } from '@/services/shortcuts/services-shortcut.js'
import { useChapterSummary } from '@/apis/chapters/composables/use-chapter-summary.js'
import ChildrenSwitcher from '@/views/chapters/parts/ChildrenSwitcher.vue'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const switcherProvide = (nextChapterId = undefined, isCurrentBranch = true) => {
  const novelStore = createNovelStore()
  const readingStore = createReadingStore()
  novelStore.setSelectedNovel(novelSeeder.getNovel())
  readingStore.setReading({
    ...chapterSeeder.getReading(),
    nextChapterId,
    isCurrentBranch,
  })

  return {
    [NOVEL_STORE_KEY]: novelStore,
    [READING_STORE_KEY]: readingStore,
  }
}

describe('ChildrenSwitcher.vue', () => {
  afterEach(() => {
    useChapterSummary().closeChapterSummary()
    vi.clearAllMocks()
  })

  it('announces how many suites the chapter already has', () => {
    const children = chapterSeeder.getCurrentBranch(2)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide() },
    })

    expect(wrapper.find('.children-switcher__title').text()).toBe('Suites de ce chapitre : 2')
  })

  it('stays out of the reading flow when nobody continued the chapter', () => {
    const wrapper = mount(ChildrenSwitcher, {
      props: { children: [] },
      global: { provide: switcherProvide() },
    })

    expect(wrapper.find('.children-switcher').exists()).toBe(false)
  })

  it('designates the suite that carries the current continuity', () => {
    const children = chapterSeeder.getCurrentBranch(2)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide(children[1].id) },
    })

    expect(wrapper.findAll('.chapter-card__popular')).toHaveLength(1)
    expect(wrapper.findAll('.children-switcher__item')[1].text()).toContain('Branche principale')
  })

  it('scopes the continuity badge to the branch when it is not the novel continuity', () => {
    const children = chapterSeeder.getCurrentBranch(2)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide(children[1].id, false) },
    })

    expect(wrapper.find('.chapter-card__popular').text()).toBe('Branche principale depuis ici')
  })

  it('takes the reader to the suite whose card is clicked', async () => {
    const children = chapterSeeder.getCurrentBranch(2)
    const push = vi.spyOn(router, 'push').mockResolvedValue()

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide() },
    })
    await wrapper.findAll('.children-switcher__item .chapter-card')[1].trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'chapter-read',
      params: { slug: novelSeeder.getNovel().slug, id: children[1].id },
    })
  })

  it('hands the summary of a suite to the dialog instead of showing it in the flow', async () => {
    const children = chapterSeeder.getCurrentBranch(1)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide() },
    })

    expect(wrapper.find('.children-switcher__list').text()).not.toContain(children[0].summary)

    await wrapper.find('.chapter-card__summary').trigger('click')

    expect(useChapterSummary().summarisedChapter.value).toEqual(children[0])
  })

  it('keeps a crowded fork readable and offers the rest on demand', async () => {
    const children = chapterSeeder.getCurrentBranch(5)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide() },
    })

    expect(wrapper.findAll('.children-switcher__item')).toHaveLength(3)
    expect(wrapper.find('.children-switcher__more').text()).toBe('Voir plus de suites (2)')

    await wrapper.find('.children-switcher__more').trigger('click')

    expect(wrapper.findAll('.children-switcher__item')).toHaveLength(5)
    expect(wrapper.find('.children-switcher__more').exists()).toBe(false)
  })

  it('names each suite by its chapter and its author, never by a branch name', () => {
    const children = chapterSeeder.getCurrentBranch(1)

    const wrapper = mount(ChildrenSwitcher, {
      props: { children },
      global: { provide: switcherProvide() },
    })

    const item = wrapper.find('.children-switcher__item')
    expect(item.text()).toContain(children[0].title)
    expect(item.text()).toContain(`par ${children[0].author.username}`)
  })

  it('keeps the reader in the same tab when a suite is opened from the reading page', () => {
    const wrapper = mount(ChildrenSwitcher, {
      props: { children: chapterSeeder.getCurrentBranch(2) },
      global: { provide: switcherProvide() },
    })

    expect(wrapper.find('.chapter-card__read').attributes('target')).toBeUndefined()
  })
})
