import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorScreenComponent from '@/components/ErrorScreenComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'

describe('ErrorScreenComponent.vue', () => {
  it('renders the translated message key', () => {
    const wrapper = mount(ErrorScreenComponent, { props: { messageKey: 'error_not_found' } })

    expect(wrapper.find('.error-screen p').text()).toBe(t('error_not_found'))
  })

  it('does not render an action button when no action is given', () => {
    const wrapper = mount(ErrorScreenComponent, { props: { messageKey: 'error_server' } })

    expect(wrapper.find('.error-screen button').exists()).toBe(false)
  })

  it('renders the action button and calls its callback on click', async () => {
    const callback = vi.fn()
    const wrapper = mount(ErrorScreenComponent, {
      props: {
        messageKey: 'error_server',
        action: { labelKey: 'retry', callback },
      },
    })

    const button = wrapper.find('.error-screen button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe(t('retry'))

    await button.trigger('click')
    expect(callback).toHaveBeenCalledOnce()
  })
})
