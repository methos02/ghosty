import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import MainBranchLostNotification from '@/views/layout/notifications/MainBranchLostNotification.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('MainBranchLostNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the lone chapter that left the main branch, linking the chapter and the novel', () => {
    const notification = notificationSeeder.getMainBranchMove('main_branch_lost', 1)

    wrapper = mount(MainBranchLostNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('main_branch_lost_notification.one', {
        title: notification.chapter.title,
        novel: notification.novel.title,
      }),
    )
    expect(message.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.chapter.id },
        },
        { name: 'novel-detail', params: { slug: notification.novel.slug } },
      ],
    )
  })

  it('counts the chapters that left together, linking only the novel', () => {
    const notification = notificationSeeder.getMainBranchMove('main_branch_lost', 2)

    wrapper = mount(MainBranchLostNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('main_branch_lost_notification.many', {
        count: notification.payload.count,
        novel: notification.novel.title,
      }),
    )
    expect(message.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [{ name: 'novel-detail', params: { slug: notification.novel.slug } }],
    )
  })
})
