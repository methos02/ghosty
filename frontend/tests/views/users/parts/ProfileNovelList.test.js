import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfileNovelList from '@/views/users/parts/ProfileNovelList.vue'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/core-vue/stores/novels/novel-store.js'
import { createProfileStore, PROFILE_STORE_KEY } from '@/core-vue/stores/users/profile-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ProfileNovelList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('loads the first page of the novels of the profile', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileNovelsApi()
    vi.spyOn(UserRepository, 'listNovels').mockResolvedValue(controllerSuccess({ data: listApi }))
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)

    wrapper = mount(ProfileNovelList, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: profileStore,
        },
      },
    })
    await flushPromises()

    expect(UserRepository.listNovels).toHaveBeenCalledWith({
      params: UserDto.toListParams(profile.slug, 1),
    })
    expect(wrapper.findAll('.novel-card')).toHaveLength(listApi.novels.length)
  })

  it('loads the next page and keeps the novels already shown', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileNovelsApi()
    vi.spyOn(UserRepository, 'listNovels').mockResolvedValue(controllerSuccess({ data: listApi }))
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)
    wrapper = mount(ProfileNovelList, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: profileStore,
        },
      },
    })
    await flushPromises()

    await wrapper.find('.profile-novel-list__more').trigger('click')
    await flushPromises()

    expect(UserRepository.listNovels).toHaveBeenLastCalledWith({
      params: UserDto.toListParams(profile.slug, 2),
    })
    expect(wrapper.findAll('.novel-card')).toHaveLength(listApi.novels.length * 2)
  })

  it('says when the profile has no novels', async () => {
    const profile = userSeeder.getProfile()
    vi.spyOn(UserRepository, 'listNovels').mockResolvedValue(
      controllerSuccess({
        data: userSeeder.getProfileNovelsApi({
          novels: [],
          meta: paginationSeeder.getMetaApi({ total: 0, last_page: 1 }),
        }),
      }),
    )
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)

    wrapper = mount(ProfileNovelList, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [PROFILE_STORE_KEY]: profileStore,
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.profile-novel-list__empty').text()).toBe(t('profile_novel_list.empty'))
    expect(wrapper.find('.profile-novel-list__more').exists()).toBe(false)
  })
})
