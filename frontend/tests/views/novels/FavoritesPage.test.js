import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoritesPage from '@/views/novels/FavoritesPage.vue'

describe('FavoritesPage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('announces the favorites as still to come, rather than showing an empty list', () => {
    wrapper = mount(FavoritesPage)

    expect(wrapper.find('h1').text()).toBe('Mes favoris')
    expect(wrapper.text()).toContain('Les favoris arrivent')
  })
})
