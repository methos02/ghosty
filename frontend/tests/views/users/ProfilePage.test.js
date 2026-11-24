import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import ProfilePage from '@/views/users/ProfilePage.vue'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/core-vue/stores/novels/novel-store.js'
import { createProfileStore, PROFILE_STORE_KEY } from '@/core-vue/stores/users/profile-store.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { PROFILE_TABS, USER_ROLES } from '@/constants/user-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ProfilePage.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(UserRepository, 'listNovels').mockResolvedValue(
      controllerSuccess({ data: userSeeder.getProfileNovelsApi() }),
    )
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useReport().report.closeReport()
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('loads the profile of the slug in the address', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(UserRepository.show).toHaveBeenCalledWith({
      params: UserDto.toProfileParams(profileApi.slug),
    })
    expect(wrapper.find('h1').text()).toBe(profileApi.username)
    expect(wrapper.find('.profile-page__since').text()).toBe(
      t('profile_page.member_since', { date: UserDto.fromProfile(profileApi).createdAtFormat }),
    )
  })

  it('shows the roles of the user except the reader one', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.findAll('.profile-page__role').map(role => role.text())).toEqual([
      t(`profile_page.roles.${USER_ROLES.AUTHOR}`),
      t(`profile_page.roles.${USER_ROLES.ILLUSTRATOR}`),
    ])
  })

  it('says the profile does not exist when the api does not find the slug', async () => {
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerError(STATUS.NOT_FOUND))
    await router.push({
      name: 'profile',
      params: { profileSlug: userSeeder.getProfileApi().profile_slug },
    })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.profile-page__not-found').text()).toBe(t('profile_page.not_found'))
    expect(wrapper.find('.profile-statistics').exists()).toBe(false)
  })

  it('opens on the novels of the user', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.profile-novel-list').exists()).toBe(true)
    expect(wrapper.find('.profile-chapter-list').exists()).toBe(false)
  })

  it('opens the tab named in the address', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    vi.spyOn(UserRepository, 'listChapters').mockResolvedValue(
      controllerSuccess({ data: userSeeder.getProfileChaptersApi() }),
    )
    await router.push({
      name: 'profile',
      params: { profileSlug: profileApi.profile_slug },
      query: { tab: PROFILE_TABS.CHAPTERS },
    })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.profile-chapter-list').exists()).toBe(true)
    expect(wrapper.find('.profile-novel-list').exists()).toBe(false)
  })

  it('writes the chosen tab in the address', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(
      controllerSuccess({ data: userSeeder.getProfileCoversApi() }),
    )
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })
    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    const coversTab = wrapper
      .findAll('.profile-page__tabs button')
      .find(tab => tab.text() === t(`profile_page.tabs.${PROFILE_TABS.COVERS}`))
    await coversTab.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.tab).toBe(PROFILE_TABS.COVERS)
    expect(wrapper.find('.profile-cover-list').exists()).toBe(true)
  })

  it('offers no report on the own profile of the reader', async () => {
    const profileApi = userSeeder.getProfileApi()
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.profile-page__report').exists()).toBe(false)
  })

  it('opens the report of the account seen by another reader', async () => {
    const profileApi = userSeeder.getProfileApi({
      id: 64,
      username: 'Importun',
      slug: 'usr064',
      profile_slug: 'usr064-importun',
    })
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })
    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    await wrapper.find('.profile-page__report').trigger('click')

    expect(useReport().reportedContent.value).toEqual({
      type: REPORTED_CONTENT_TYPES.USER,
      content: UserDto.fromProfile(profileApi),
    })
  })

  it('replaces an outdated name in the address and says the pseudonym changed', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({
      name: 'profile',
      params: { profileSlug: `${profileApi.slug}-ancien-pseudo` },
      query: { tab: PROFILE_TABS.NOVELS },
    })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(router.currentRoute.value.params.profileSlug).toBe(profileApi.profile_slug)
    expect(router.currentRoute.value.query.tab).toBe(PROFILE_TABS.NOVELS)
    expect(wrapper.find('.profile-page__renamed').text()).toBe(t('profile_page.renamed'))
    expect(wrapper.text()).not.toContain('ancien-pseudo')
    expect(UserRepository.show).toHaveBeenCalledTimes(1)
  })

  it('completes an address holding only the slug without saying the pseudonym changed', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(router.currentRoute.value.params.profileSlug).toBe(profileApi.profile_slug)
    expect(wrapper.find('.profile-page__renamed').exists()).toBe(false)
  })

  it('keeps the address and says nothing when the profile slug is current', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: createProfileStore(),
        },
      },
    })
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe(`/users/${profileApi.profile_slug}`)
    expect(wrapper.find('.profile-page__renamed').exists()).toBe(false)
  })

  it('renders the profile the server already loaded without asking it again', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(UserRepository, 'show')
    const profileStore = createProfileStore()
    profileStore.setProfile(UserDto.fromProfile(profileApi))
    await router.push({ name: 'profile', params: { profileSlug: profileApi.profile_slug } })

    wrapper = mount(ProfilePage, {
      global: {
        plugins: [createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: profileStore,
        },
      },
    })
    await flushPromises()

    expect(UserRepository.show).not.toHaveBeenCalled()
    expect(wrapper.find('h1').text()).toBe(profileApi.username)
  })
})
