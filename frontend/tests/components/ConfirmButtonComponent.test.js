import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ConfirmButton from '@/components/ConfirmButtonComponent.vue'

describe('ConfirmButtonComponent.vue', () => {
  let wrapper

  const mountButton = (cb, params = []) => {
    wrapper = mount(ConfirmButton, {
      props: { cb, params, question: 'Supprimer ce brouillon ?' },
      slots: { default: 'Supprimer' },
    })
    return wrapper
  }

  afterEach(() => {
    vi.clearAllMocks()
    wrapper?.unmount()
    wrapper = undefined
  })

  it('does not run the callback on the first click', async () => {
    const cb = vi.fn()
    mountButton(cb)

    await wrapper.find('button').trigger('click')

    expect(cb).not.toHaveBeenCalled()
  })

  it('shows the question once asked', async () => {
    mountButton(vi.fn())

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.confirm-button__question').text()).toBe('Supprimer ce brouillon ?')
  })

  it('runs the callback with its params once confirmed', async () => {
    const cb = vi.fn()
    const draft = { id: 12 }
    mountButton(cb, [draft])

    await wrapper.find('button').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(cb).toHaveBeenCalledWith(draft)
  })

  it('leaves the callback alone when cancelled', async () => {
    const cb = vi.fn()
    mountButton(cb)

    await wrapper.find('button').trigger('click')
    await wrapper.find('.confirm-button__cancel').trigger('click')
    await flushPromises()

    expect(cb).not.toHaveBeenCalled()
  })
})
