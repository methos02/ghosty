import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import MainBranchGainedNotificationDetail from '@/views/layout/notifications/details/MainBranchGainedNotificationDetail.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('MainBranchGainedNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('lists every chapter joining the main branch, each leading to its chapter', () => {
    const notification = notificationSeeder.getChaptersPayload('main_branch_gained', 3)

    wrapper = mount(MainBranchGainedNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('main_branch_gained_notification_detail.chapters', { novel: notification.novel.title }),
    )
    expect(wrapper.findAll('.notification-chapter-list li').map(chapter => chapter.text())).toEqual(
      notification.payload.chapters.map(chapter => chapter.title),
    )
    expect(
      wrapper
        .findAllComponents({ name: 'RouterLink' })
        .slice(1)
        .map(link => link.props('to')),
    ).toEqual(
      notification.payload.chapters.map(chapter => ({
        name: 'chapter-read',
        params: { slug: notification.novel.slug, id: chapter.id },
      })),
    )
  })
})
