import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '@/views/parts/SearchBar.vue'
import { useSearchNovels } from '@/composables/use-search-novels.js'

describe('SearchBar.vue', () => {
  describe('tabs', () => {
    it('emits update:activeTab with "search" when clicking the search tab', async () => {
      const wrapper = mount(SearchBar, { props: { activeTab: 'home' } })

      const searchTab = wrapper.findAll('.search-bar__tab')[1]
      await searchTab.trigger('click')

      expect(wrapper.emitted('update:activeTab')).toEqual([['search']])
    })

    it('marks the active tab based on the model', () => {
      const wrapper = mount(SearchBar, { props: { activeTab: 'home' } })

      const [homeTab] = wrapper.findAll('.search-bar__tab')
      expect(homeTab.classes()).toContain('search-bar__tab--active')
    })
  })

  describe('sort dropdown', () => {
    it('updates the selected sort when picking an option', async () => {
      const wrapper = mount(SearchBar, { props: { activeTab: 'home' } })
      const { selectedSort } = useSearchNovels()

      const option = wrapper.findAll('.dropdown-item').find(item => item.text() === 'Récents')
      await option.trigger('click')

      expect(selectedSort.value).toBe('Récents')
    })
  })

  describe('genre dropdown', () => {
    it('updates the selected genre when picking an option', async () => {
      const wrapper = mount(SearchBar, { props: { activeTab: 'home' } })
      const { selectedGenre } = useSearchNovels()

      const option = wrapper.findAll('.dropdown-item').find(item => item.text() === 'Horreur')
      await option.trigger('click')

      expect(selectedGenre.value).toBe('Horreur')
    })
  })
})
