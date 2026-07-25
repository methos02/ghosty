import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NovelCard from '@/views/parts/NovelCard.vue'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('NovelCard.vue', () => {
  afterEach(() => {
    useNovelStore().clearSelectedNovel()
  })

  it('renders the novel title, genre label and cover image', () => {
    const novel = novelSeeder.getNovel()
    const wrapper = mount(NovelCard, { props: { novel } })

    expect(wrapper.find('.novel-card__title').text()).toBe(novel.title)
    expect(wrapper.find('.novel-card__genre').text()).toBe(novel.genre.label)

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(novel.coverUrl)
    expect(img.attributes('alt')).toBe(novel.title)
  })

  it('selects the novel in the store on click', async () => {
    const novel = novelSeeder.getNovel()
    const wrapper = mount(NovelCard, { props: { novel } })

    await wrapper.find('.novel-card').trigger('click')

    expect(useNovelStore().selectedNovel.value).toEqual(novel)
  })
})
