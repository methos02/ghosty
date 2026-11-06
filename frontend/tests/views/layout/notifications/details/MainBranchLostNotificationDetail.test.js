import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import MainBranchLostNotificationDetail from '@/views/layout/notifications/details/MainBranchLostNotificationDetail.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('MainBranchLostNotificationDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('lists the chapters that left the main branch and invites to promote the branch', () => {
    const notification = notificationSeeder.getChaptersPayload('main_branch_lost', 2)

    wrapper = mount(MainBranchLostNotificationDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('main_branch_lost_notification_detail.chapters', { novel: notification.novel.title }),
    )
    expect(wrapper.findAll('.notification-chapter-list li').map(chapter => chapter.text())).toEqual(
      notification.payload.chapters.map(chapter => chapter.title),
    )
    expect(wrapper.text()).toContain(t('main_branch_lost_notification_detail.promote'))
    const readBranchLink = wrapper
      .findAllComponents({ name: 'RouterLink' })
      .find(link => link.classes().includes('main-branch-lost-detail__read'))
    expect(readBranchLink.props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
  })
})
