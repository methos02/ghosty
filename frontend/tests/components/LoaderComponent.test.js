import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoaderComponent from '@/components/LoaderComponent.vue'

describe('LoaderComponent.vue', () => {
  it('throws when neither click nor cb is provided', () => {
    expect(() => mount(LoaderComponent)).toThrow(/click ou cb/)
  })

  it('renders the default slot content', () => {
    const wrapper = mount(LoaderComponent, {
      props: { cb: vi.fn() },
      slots: { default: 'Envoyer' },
    })

    expect(wrapper.text()).toContain('Envoyer')
  })

  it('runs the callback with params on click', async () => {
    const cb = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(LoaderComponent, {
      props: { cb, params: [1, 'a'] },
      slots: { default: 'Valider' },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(cb).toHaveBeenCalledWith(1, 'a')
  })

  it('does not run the callback when disabled', async () => {
    const cb = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(LoaderComponent, {
      props: { cb, disabled: true },
      slots: { default: 'Valider' },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(cb).not.toHaveBeenCalled()
  })

  it('resets loading after the callback resolves', async () => {
    const cb = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(LoaderComponent, {
      props: { cb },
      slots: { default: 'Valider' },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('keeps loading when infinite is set', async () => {
    const cb = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(LoaderComponent, {
      props: { cb, infinite: true },
      slots: { default: 'Valider' },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
