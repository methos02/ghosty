import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ModerationDesktopOnly from '@/views/moderation/parts/ModerationDesktopOnly.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'

describe('ModerationDesktopOnly.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('renders the moderation page it guards', () => {
    wrapper = mount(ModerationDesktopOnly, {
      slots: { default: '<section class="moderation-case">Dossier</section>' },
    })

    expect(wrapper.find('.moderation-desktop-only__content .moderation-case').exists()).toBe(true)
  })

  it('asks the moderator to switch to a larger screen', () => {
    wrapper = mount(ModerationDesktopOnly)

    const notice = wrapper.find('.moderation-desktop-only__screen-too-small')
    expect(notice.text()).toContain(t('moderation_desktop_only.title'))
    expect(notice.text()).toContain(t('moderation_desktop_only.message'))
  })
})
