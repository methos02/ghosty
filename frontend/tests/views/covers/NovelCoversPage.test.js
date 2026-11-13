import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import NovelCoversPage from '@/views/covers/NovelCoversPage.vue'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('NovelCoversPage.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuth().closeLoginDialog()
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('shows the title of the novel and every cover proposed for it', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const listApi = coverSeeder.getListApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })

    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    expect(CoverRepository.list).toHaveBeenCalledWith({
      params: CoverDto.toNovelParams(novelApi.slug),
    })
    expect(wrapper.find('.novel-covers-page__novel').text()).toBe(novelApi.title)
    expect(wrapper.findAll('.cover-card')).toHaveLength(listApi.covers.length)
  })

  it('marks only the official cover of the novel', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const listApi = coverSeeder.getListApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })

    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    const officialFlags = wrapper
      .findAll('.cover-card')
      .map(card => card.classes().includes('cover-card--official'))
    expect(officialFlags).toEqual(
      listApi.covers.map(cover => cover.id === listApi.official_cover_id),
    )
  })

  it('invites to propose the first cover of a novel that has none', async () => {
    const novelApi = novelSeeder.getNovelApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(
      controllerSuccess({
        data: coverSeeder.getListApi({
          covers: [],
          official_cover_id: null,
        }),
      }),
    )
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })

    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    expect(wrapper.find('.novel-covers-page__empty').text()).toBe(t('novel_covers_page.empty'))
  })

  it('asks an anonymous reader to log in before proposing a cover', async () => {
    const novelApi = novelSeeder.getNovelApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: coverSeeder.getListApi() }),
    )
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })
    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    await wrapper.find('.novel-covers-page__propose').trigger('click')

    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('offers the illustrator to replace the cover already proposed', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const myCoverApi = coverSeeder.getCoverApi()
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: coverSeeder.getListApi({ my_cover_id: myCoverApi.id }) }),
    )
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })

    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    expect(wrapper.find('.novel-covers-page__replace').text()).toBe(t('novel_covers_page.replace'))
    expect(wrapper.find('.novel-covers-page__propose').exists()).toBe(false)
  })

  it('empties the novel covers when the reader leaves the page', async () => {
    const novelApi = novelSeeder.getNovelApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(CoverRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: coverSeeder.getListApi() }),
    )
    await router.push({ name: 'novel-covers', params: { slug: novelApi.slug } })
    wrapper = mount(NovelCoversPage, {
      global: { plugins: [createHead()] },
    })
    await flushPromises()

    wrapper.unmount()
    wrapper = undefined

    expect(useCoverStore().covers.value).toEqual([])
  })
})
