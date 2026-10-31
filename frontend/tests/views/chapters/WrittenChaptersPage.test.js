import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WrittenChaptersPage from '@/views/chapters/WrittenChaptersPage.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('WrittenChaptersPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  it('lists the chapters of the author under the novel they were written in', async () => {
    vi.spyOn(ChapterRepository, 'published').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getPublishedApi() }),
    )
    const [group] = chapterSeeder.getPublished()
    wrapper = mount(WrittenChaptersPage)
    await flushPromises()

    const novel = wrapper.find('.written-chapters-page__novel')
    expect(novel.find('.written-chapters-page__novel-title').text()).toBe(group.novel.title)
    expect(
      novel.findAll('.written-chapters-page__chapter-title').map(title => title.text()),
    ).toEqual(group.chapters.map(chapter => chapter.title))
  })

  it('opens a chapter in the reader of its novel', async () => {
    vi.spyOn(ChapterRepository, 'published').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getPublishedApi() }),
    )
    const [group] = chapterSeeder.getPublished()
    wrapper = mount(WrittenChaptersPage)
    await flushPromises()

    expect(wrapper.findComponent('.written-chapters-page__chapter-title').props('to')).toEqual({
      name: 'chapter-read',
      params: { slug: group.novel.slug, id: group.chapters[0].id },
    })
  })

  it('invites the author to start a novel when nothing is published yet', async () => {
    vi.spyOn(ChapterRepository, 'published').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getPublishedApi({ novels: [] }) }),
    )
    wrapper = mount(WrittenChaptersPage)
    await flushPromises()

    expect(wrapper.find('.written-chapters-page__empty').exists()).toBe(true)
    expect(wrapper.find('.written-chapters-page__create').exists()).toBe(true)
  })
})
