import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ChapterContinuedNotification from '@/views/layout/notifications/ChapterContinuedNotification.vue'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('ChapterContinuedNotification.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('names a lone continuation and its parent, each title leading to its chapter', () => {
    const notification = notificationSeeder.getChapterContinued(1)

    wrapper = mount(ChapterContinuedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('chapter_continued_notification.one', {
        author: notification.payload.continuation.authorUsername,
        continuation: notification.payload.continuation.title,
        title: notification.chapter.title,
      }),
    )
    expect(message.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      [
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.payload.continuation.id },
        },
        {
          name: 'chapter-read',
          params: { slug: notification.novel.slug, id: notification.chapter.id },
        },
      ],
    )
  })

  it('counts gathered continuations, the parent title leading to the parent chapter', () => {
    const notification = notificationSeeder.getChapterContinued(3)

    wrapper = mount(ChapterContinuedNotification, { props: { notification } })

    const message = wrapper.find('.notification-base__message')
    expect(message.text()).toBe(
      t('chapter_continued_notification.many', {
        count: notification.payload.count,
        title: notification.chapter.title,
      }),
    )
    expect(message.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: notification.novel.slug, id: notification.chapter.id },
    })
  })
})
