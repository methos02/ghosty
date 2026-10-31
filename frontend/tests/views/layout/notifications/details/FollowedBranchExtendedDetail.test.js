import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import FollowedBranchExtendedDetail from '@/views/layout/notifications/details/FollowedBranchExtendedDetail.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('FollowedBranchExtendedDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('lists every new chapter of the followed branches, each leading to its chapter', () => {
    const notification = notificationSeeder.getChaptersPayload('followed_branch_extended', 2)

    wrapper = mount(FollowedBranchExtendedDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('followed_branch_extended_detail.chapters', { novel: notification.novel.title }),
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
