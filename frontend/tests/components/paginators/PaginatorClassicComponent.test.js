import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginatorClassicComponent from '@/components/paginators/PaginatorClassicComponent.vue'

describe('PaginatorClassicComponent.vue', () => {
  it('renders a button per page and marks the current page as active', () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 1, lastPage: 5, size: 15 } },
    })

    expect(wrapper.find('.paginator-li.active .paginator-current').text()).toBe('1')
    expect(wrapper.find('[data-page="2"]').exists()).toBe(true)
    expect(wrapper.find('[data-page="5"]').exists()).toBe(true)
  })

  it('disables the previous link on the first page and keeps next enabled', () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 1, lastPage: 5, size: 15 } },
    })

    expect(wrapper.find('button[data-button="previous"]').exists()).toBe(false)
    expect(wrapper.find('li[data-button="previous"].disabled').exists()).toBe(true)
    expect(wrapper.find('button[data-button="next"]').exists()).toBe(true)
  })

  it('disables the next link on the last page', () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 5, lastPage: 5, size: 15 } },
    })

    expect(wrapper.find('button[data-button="next"]').exists()).toBe(false)
    expect(wrapper.find('li[data-button="next"].disabled').exists()).toBe(true)
  })

  it('emits p-classic with the page and size when clicking a page', async () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 1, lastPage: 5, size: 15 } },
    })

    await wrapper.find('[data-page="3"]').trigger('click')

    expect(wrapper.emitted('p-classic')).toEqual([[{ page: 3, size: 15 }]])
  })

  it('emits the next page when clicking the next link', async () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 2, lastPage: 5, size: 15 } },
    })

    await wrapper.find('button[data-button="next"]').trigger('click')

    expect(wrapper.emitted('p-classic')).toEqual([[{ page: 3, size: 15 }]])
  })

  it('inserts an ellipsis for wide page ranges', () => {
    const wrapper = mount(PaginatorClassicComponent, {
      props: { params: { page: 10, lastPage: 20, size: 10 } },
    })

    expect(wrapper.text()).toContain('...')
  })
})
