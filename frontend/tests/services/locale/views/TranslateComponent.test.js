import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import TranslateComponent from '@/services/locale/views/TranslateComponent.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('TranslateComponent.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('renders the translated sentence with each slot where its placeholder stands', () => {
    const notification = notificationSeeder.getLikeReceived(1)

    wrapper = mount(TranslateComponent, {
      props: { keypath: 'like_received_notification.one', tag: 'p' },
      slots: {
        author: notification.payload.lastActorUsername,
        title: `<a class="chapter-title">${notification.chapter.title}</a>`,
      },
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe(
      t('like_received_notification.one', {
        author: notification.payload.lastActorUsername,
        title: notification.chapter.title,
      }),
    )
    expect(wrapper.find('a.chapter-title').text()).toBe(notification.chapter.title)
  })
})
