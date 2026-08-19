import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundPage from '@/views/NotFoundPage.vue'

describe('NotFoundPage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the error and offers the way back', () => {
    wrapper = mount(NotFoundPage)

    expect(wrapper.find('.not-found-page__code').text()).toBe('404')
    expect(wrapper.find('h1').text()).toBe('Page introuvable')
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toBe('/')
  })
})
