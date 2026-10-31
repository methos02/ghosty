import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import ReadingsPage from '@/views/readings/ReadingsPage.vue'
import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { readingProgressSeeder } from '&/utils/seeders/reading-progress-seeder.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

const router = routerPlugin.getRouter()

describe('ReadingsPage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('opens on the novels to resume', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: readingProgressSeeder.getListApi() }),
    )
    vi.spyOn(FollowRepository, 'list')

    wrapper = mount(ReadingsPage, { global: { plugins: [router, createHead()] } })
    await flushPromises()

    expect(wrapper.find('.resume-reading-list').exists()).toBe(true)
    expect(wrapper.find('.readings-page__tab-resume').attributes('aria-pressed')).toBe('true')
    expect(FollowRepository.list).not.toHaveBeenCalled()
  })

  it('shows the followed branches once their tab is chosen', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: readingProgressSeeder.getListApi() }),
    )
    vi.spyOn(FollowRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getListApi() }),
    )

    wrapper = mount(ReadingsPage, { global: { plugins: [router, createHead()] } })
    await flushPromises()
    await wrapper.find('.readings-page__tab-followed').trigger('click')
    await flushPromises()

    expect(wrapper.find('.followed-branch-list').exists()).toBe(true)
    expect(wrapper.find('.resume-reading-list').exists()).toBe(false)
  })

  it('shows the reading history once its tab is chosen', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: readingProgressSeeder.getListApi() }),
    )
    vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: chapterReadSeeder.getListApi() }),
    )

    wrapper = mount(ReadingsPage, { global: { plugins: [router, createHead()] } })
    await flushPromises()
    await wrapper.find('.readings-page__tab-history').trigger('click')
    await flushPromises()

    expect(wrapper.find('.reading-history-list').exists()).toBe(true)
  })
})
