import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ChapterContinuedDetail from '@/views/layout/notifications/details/ChapterContinuedDetail.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ChapterContinuedDetail.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('counts the continuations and leads to the parent and to the latest one', () => {
    const notification = notificationSeeder.getChapterContinued(3)

    wrapper = mount(ChapterContinuedDetail, { props: { notification } })

    expect(wrapper.text()).toContain(
      t('chapter_continued_detail.continuations.many', {
        title: notification.chapter.title,
        count: notification.payload.count,
      }),
    )
    expect(wrapper.text()).toContain(
      t('chapter_continued_detail.latest', {
        continuation: notification.payload.continuation.title,
        author: notification.payload.continuation.authorUsername,
      }),
    )
    expect(wrapper.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.chapter.id },
        },
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.payload.continuation.id },
        },
      ],
    )
  })
})
