import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CommentThread from '@/views/comments/CommentThread.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('CommentThread.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useCommentStore().commentStore.clear()
    vi.clearAllMocks()
  })

  it('loads the first page of the thread of its target and shows each comment', async () => {
    const target = commentSeeder.getChapterTarget()
    const threadApi = commentSeeder.getThreadApi()
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: threadApi }),
    )

    wrapper = mount(CommentThread, { props: { target } })
    await flushPromises()

    expect(CommentRepository.listForChapter).toHaveBeenCalledWith({
      params: CommentDto.toThreadParams(target, 1),
    })
    expect(wrapper.findAll('.comment-content__text').map(text => text.text())).toEqual(
      threadApi.comments.map(comment => comment.content),
    )
  })

  it('invites to react first when the thread has no comment', async () => {
    vi.spyOn(CommentRepository, 'listForNovel').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getEmptyThreadApi() }),
    )

    wrapper = mount(CommentThread, { props: { target: commentSeeder.getNovelTarget() } })
    await flushPromises()

    expect(wrapper.find('.comment-thread__empty').text()).toBe(t('comment_thread.empty'))
  })

  it('appends the next page of comments on demand and hides the button on the last page', async () => {
    const target = commentSeeder.getChapterTarget()
    const firstPage = commentSeeder.getThreadApi({
      meta: paginationSeeder.getMetaApi({ last_page: 2 }),
    })
    const secondPage = commentSeeder.getThreadApi({
      comments: [commentSeeder.getCommentApi({ id: 99 })],
      meta: paginationSeeder.getMetaApi({ current_page: 2, last_page: 2 }),
    })
    vi.spyOn(CommentRepository, 'listForChapter')
      .mockResolvedValueOnce(controllerSuccess({ data: firstPage }))
      .mockResolvedValueOnce(controllerSuccess({ data: secondPage }))

    wrapper = mount(CommentThread, { props: { target } })
    await flushPromises()
    await wrapper.find('.comment-thread__more').trigger('click')
    await flushPromises()

    expect(CommentRepository.listForChapter).toHaveBeenLastCalledWith({
      params: CommentDto.toThreadParams(target, 2),
    })
    expect(wrapper.findAll('.comment-card')).toHaveLength(3)
    expect(wrapper.find('.comment-thread__more').exists()).toBe(false)
  })

  it('empties the shared comment store once the thread is left', async () => {
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )
    wrapper = mount(CommentThread, { props: { target: commentSeeder.getChapterTarget() } })
    await flushPromises()

    wrapper.unmount()
    wrapper = undefined

    expect(useCommentStore().comments.value).toEqual([])
  })
})
