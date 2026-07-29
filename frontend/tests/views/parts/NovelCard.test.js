import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NovelCard from '@/views/parts/NovelCard.vue'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const mountNovelCard = novel =>
  mount(NovelCard, {
    props: { novel },
    global: { provide: { [NOVEL_STORE_KEY]: createNovelStore() } },
  })

describe('NovelCard.vue', () => {
  it('renders the novel title, genre label and cover image', () => {
    const novel = novelSeeder.getNovel()
    const wrapper = mountNovelCard(novel)

    expect(wrapper.find('.novel-card__title').text()).toBe(novel.title)
    expect(wrapper.find('.novel-card__genre').text()).toBe(novel.genre.label)

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(novel.coverUrl)
    expect(img.attributes('alt')).toBe(novel.title)
  })

  it('links to the novel detail page for its slug', () => {
    const novel = novelSeeder.getNovel()
    const wrapper = mountNovelCard(novel)

    const link = wrapper.getComponent({ name: 'router-link' })

    expect(link.props('to')).toEqual({ name: 'novel-detail', params: { slug: novel.slug } })
  })
})
