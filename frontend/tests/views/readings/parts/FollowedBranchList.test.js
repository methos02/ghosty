import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FollowedBranchList from '@/views/readings/parts/FollowedBranchList.vue'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('FollowedBranchList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    flash.clearFlashes()
    vi.clearAllMocks()
  })

  it('names each followed branch by its heading chapter and its author', async () => {
    const listApi = followSeeder.getListApi()
    vi.spyOn(FollowRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    const follows = FollowDto.fromList(listApi.follows)

    wrapper = mount(FollowedBranchList)
    await flushPromises()

    expect(wrapper.findAll('.followed-branch-list__branch').map(branch => branch.text())).toEqual(
      follows.map(follow =>
        t('followed_branch_list.branch', {
          title: follow.chapter.title,
          author: follow.chapter.author.username,
        }),
      ),
    )
  })

  it('removes a branch from the list once the reader stops following it', async () => {
    const listApi = followSeeder.getListApi()
    vi.spyOn(FollowRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    vi.spyOn(FollowRepository, 'unfollow').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getFollowStateApi({ is_followed: false }) }),
    )
    const [first, second] = FollowDto.fromList(listApi.follows)

    wrapper = mount(FollowedBranchList)
    await flushPromises()
    await wrapper.find('.followed-branch-list__unfollow').trigger('click')
    await flushPromises()

    expect(FollowRepository.unfollow).toHaveBeenCalledWith({
      params: FollowDto.toChapterParams(first.chapter.id),
    })
    expect(wrapper.findAll('.followed-branch-list__branch').map(branch => branch.text())).toEqual([
      t('followed_branch_list.branch', {
        title: second.chapter.title,
        author: second.chapter.author.username,
      }),
    ])
    expect(flash.getFlashes().at(-1).content).toBe(t('followed_branch_list.unfollowed'))
  })

  it('loads the next page of followed branches on demand', async () => {
    const firstPage = followSeeder.getListApi({
      meta: paginationSeeder.getMetaApi({ last_page: 2 }),
    })
    const secondPage = followSeeder.getListApi({
      follows: [followSeeder.getFollowApi({ chapter: chapterSeeder.getChapterApi({ id: 99 }) })],
      meta: paginationSeeder.getMetaApi({ current_page: 2, last_page: 2 }),
    })
    vi.spyOn(FollowRepository, 'list')
      .mockResolvedValueOnce(controllerSuccess({ data: firstPage }))
      .mockResolvedValueOnce(controllerSuccess({ data: secondPage }))

    wrapper = mount(FollowedBranchList)
    await flushPromises()
    await wrapper.find('.followed-branch-list__more').trigger('click')
    await flushPromises()

    expect(FollowRepository.list).toHaveBeenLastCalledWith({ params: FollowDto.toListParams(2) })
    expect(wrapper.findAll('.followed-branch-list__item')).toHaveLength(3)
    expect(wrapper.find('.followed-branch-list__more').exists()).toBe(false)
  })

  it('says so when no branch is followed', async () => {
    vi.spyOn(FollowRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getListApi({ follows: [] }) }),
    )

    wrapper = mount(FollowedBranchList)
    await flushPromises()

    expect(wrapper.find('.followed-branch-list__empty').text()).toBe(
      t('followed_branch_list.empty'),
    )
  })
})
