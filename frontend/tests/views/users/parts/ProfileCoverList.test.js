import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfileCoverList from '@/views/users/parts/ProfileCoverList.vue'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ProfileCoverList.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    await router.push('/')
    vi.clearAllMocks()
  })

  it('loads the first page of the covers of the profile', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileCoversApi()
    vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'profile', params: { username: profile.username } })

    wrapper = mount(ProfileCoverList)
    await flushPromises()

    expect(UserRepository.listCovers).toHaveBeenCalledWith({
      params: UserDto.toListParams(profile.username, 1),
    })
    expect(wrapper.findAll('.profile-cover-list__item')).toHaveLength(listApi.covers.length)
  })

  it('loads the next page and keeps the covers already shown', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileCoversApi()
    vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'profile', params: { username: profile.username } })
    wrapper = mount(ProfileCoverList)
    await flushPromises()

    await wrapper.find('.profile-cover-list__more').trigger('click')
    await flushPromises()

    expect(UserRepository.listCovers).toHaveBeenLastCalledWith({
      params: UserDto.toListParams(profile.username, 2),
    })
    expect(wrapper.findAll('.profile-cover-list__item')).toHaveLength(listApi.covers.length * 2)
  })

  it('says when the profile has no covers', async () => {
    const profile = userSeeder.getProfile()
    vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(
      controllerSuccess({
        data: userSeeder.getProfileCoversApi({
          covers: [],
          meta: paginationSeeder.getMetaApi({ total: 0, last_page: 1 }),
        }),
      }),
    )
    await router.push({ name: 'profile', params: { username: profile.username } })

    wrapper = mount(ProfileCoverList)
    await flushPromises()

    expect(wrapper.find('.profile-cover-list__empty').text()).toBe(t('profile_cover_list.empty'))
    expect(wrapper.find('.profile-cover-list__more').exists()).toBe(false)
  })

  it('marks the official cover and leads to the covers of its novel', async () => {
    const profile = userSeeder.getProfile()
    const listApi = userSeeder.getProfileCoversApi()
    vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(controllerSuccess({ data: listApi }))
    await router.push({ name: 'profile', params: { username: profile.username } })

    wrapper = mount(ProfileCoverList)
    await flushPromises()

    expect(wrapper.find('.profile-cover-list__official').text()).toBe(
      t('profile_cover_list.official'),
    )
    expect(wrapper.findComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'novel-covers',
      params: { slug: listApi.covers[0].novel.slug },
    })
  })
})
