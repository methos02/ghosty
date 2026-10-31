import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import FollowedBranchExtendedNotification from '@/views/layout/notifications/FollowedBranchExtendedNotification.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('FollowedBranchExtendedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names the lone new chapter of the followed branch, linking the chapter and the novel', () => {
    const notification = notificationSeeder.getChaptersPayload('followed_branch_extended', 1)

    wrapper = mount(FollowedBranchExtendedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('followed_branch_extended_notification.one', {
        title: notification.chapter.title,
        novel: notification.novel.title,
      }),
    )
    expect(message.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [
        { name: 'novel-detail', params: { slug: notification.novel.slug } },
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.chapter.id },
        },
      ],
    )
  })

  it('counts the new chapters of the followed branches, linking only the novel', () => {
    const notification = notificationSeeder.getChaptersPayload('followed_branch_extended', 3)

    wrapper = mount(FollowedBranchExtendedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('followed_branch_extended_notification.many', {
        count: notification.payload.count,
        novel: notification.novel.title,
      }),
    )
    expect(message.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [{ name: 'novel-detail', params: { slug: notification.novel.slug } }],
    )
  })
})
