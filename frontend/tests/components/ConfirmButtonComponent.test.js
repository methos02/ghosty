import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ConfirmButton from '@/components/ConfirmButtonComponent.vue'

describe('ConfirmButtonComponent.vue', () => {
  let wrapper

  afterEach(() => {
    vi.clearAllMocks()
    wrapper?.unmount()
    wrapper = undefined
  })

  it('does not run the callback on the first click', async () => {
    const cb = vi.fn()
    wrapper = mount(ConfirmButton, {
      props: { cb, params: [], question: 'Supprimer ce brouillon ?' },
      slots: { default: 'Supprimer' },
    })

    await wrapper.find('button').trigger('click')

    expect(cb).not.toHaveBeenCalled()
  })

  it('shows the question once asked', async () => {
    wrapper = mount(ConfirmButton, {
      props: { cb: vi.fn(), params: [], question: 'Supprimer ce brouillon ?' },
      slots: { default: 'Supprimer' },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.confirm-button__question').text()).toBe('Supprimer ce brouillon ?')
  })

  it('runs the callback with its params once confirmed', async () => {
    const cb = vi.fn()
    const draft = { id: 12 }
    wrapper = mount(ConfirmButton, {
      props: { cb, params: [draft], question: 'Supprimer ce brouillon ?' },
      slots: { default: 'Supprimer' },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(cb).toHaveBeenCalledWith(draft)
  })

  it('leaves the callback alone when cancelled', async () => {
    const cb = vi.fn()
    wrapper = mount(ConfirmButton, {
      props: { cb, params: [], question: 'Supprimer ce brouillon ?' },
      slots: { default: 'Supprimer' },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.find('.confirm-button__cancel').trigger('click')
    await flushPromises()

    expect(cb).not.toHaveBeenCalled()
  })
})
