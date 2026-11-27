import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { RouterView } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { READINGS_TABS } from '@/constants/reading-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { readingProgressSeeder } from '&/utils/seeders/reading-progress-seeder.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ReadingsPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
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
    useAuthStore().setUser(userSeeder.getUser())
    await router.push('/me/readings')

    wrapper = mount(RouterView, { global: { plugins: [router, createHead()] } })
    await flushPromises()

    expect(wrapper.find('.resume-reading-list').exists()).toBe(true)
    expect(wrapper.find('.tabs-layout__menu [aria-current="page"]').text()).toBe(
      t(`readings.tabs.${READINGS_TABS.RESUME}`),
    )
    expect(FollowRepository.list).not.toHaveBeenCalled()
  })

  it('shows the followed branches on their address', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(FollowRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await router.push('/me/readings/followed')

    wrapper = mount(RouterView, { global: { plugins: [router, createHead()] } })
    await flushPromises()

    expect(router.currentRoute.value.name).toBe(READINGS_TABS.FOLLOWED)
    expect(wrapper.find('.followed-branch-list').exists()).toBe(true)
    expect(wrapper.find('.resume-reading-list').exists()).toBe(false)
  })

  it('shows the reading history once it is picked from the phone selector', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: readingProgressSeeder.getListApi() }),
    )
    vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: chapterReadSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await router.push('/me/readings')
    wrapper = mount(RouterView, { global: { plugins: [router, createHead()] } })
    await flushPromises()

    await wrapper.find('.tabs-layout__select select').setValue(READINGS_TABS.HISTORY)

    await vi.waitFor(() => expect(wrapper.find('.reading-history-list').exists()).toBe(true), {
      timeout: 10_000,
    })
    expect(router.currentRoute.value.fullPath).toBe('/me/readings/history')
  })
})
