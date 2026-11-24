import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfileBranchList from '@/views/users/parts/ProfileBranchList.vue'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { createProfileStore, PROFILE_STORE_KEY } from '@/core-vue/stores/users/profile-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ProfileBranchList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('loads the first page of the continued chapters of the profile', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileChaptersApi()
    vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(controllerSuccess({ data: listApi }))
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)

    wrapper = mount(ProfileBranchList, {
      global: { provide: { [PROFILE_STORE_KEY]: profileStore } },
    })
    await flushPromises()

    expect(UserRepository.listBranches).toHaveBeenCalledWith({
      params: UserDto.toListParams(profile.slug, 1),
    })
    expect(wrapper.findAll('.profile-chapter-item')).toHaveLength(listApi.chapters.length)
  })

  it('loads the next page and keeps the continued chapters already shown', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileChaptersApi()
    vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(controllerSuccess({ data: listApi }))
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)
    wrapper = mount(ProfileBranchList, {
      global: { provide: { [PROFILE_STORE_KEY]: profileStore } },
    })
    await flushPromises()

    await wrapper.find('.profile-branch-list__more').trigger('click')
    await flushPromises()

    expect(UserRepository.listBranches).toHaveBeenLastCalledWith({
      params: UserDto.toListParams(profile.slug, 2),
    })
    expect(wrapper.findAll('.profile-chapter-item')).toHaveLength(listApi.chapters.length * 2)
  })

  it('says when the profile has no continued chapters', async () => {
    const profile = userSeeder.getProfile()
    vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(
      controllerSuccess({
        data: userSeeder.getProfileChaptersApi({
          chapters: [],
          meta: paginationSeeder.getMetaApi({ total: 0, last_page: 1 }),
        }),
      }),
    )
    const profileStore = createProfileStore()
    profileStore.setProfile(profile)

    wrapper = mount(ProfileBranchList, {
      global: { provide: { [PROFILE_STORE_KEY]: profileStore } },
    })
    await flushPromises()

    expect(wrapper.find('.profile-branch-list__empty').text()).toBe(t('profile_branch_list.empty'))
    expect(wrapper.find('.profile-branch-list__more').exists()).toBe(false)
  })
})
