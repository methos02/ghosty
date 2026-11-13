import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoverCommentsDialog from '@/views/covers/parts/CoverCommentsDialog.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useCoverComments } from '@/core-vue/composables/comments/use-cover-comments.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('CoverCommentsDialog.vue', () => {
  let wrapper

  afterEach(() => {
    useCoverComments().coverComments.close()
    useCoverStore().coverStore.clear()
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('does not load any comment while the dialog is closed', async () => {
    vi.spyOn(CommentRepository, 'listForCover').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )

    wrapper = mount(CoverCommentsDialog)
    await flushPromises()

    expect(CommentRepository.listForCover).not.toHaveBeenCalled()
    expect(wrapper.find('.comment-thread').exists()).toBe(false)
  })

  it('loads the comments of the cover the reader opened them on', async () => {
    const cover = coverSeeder.getCover()
    const threadApi = commentSeeder.getThreadApi()
    vi.spyOn(CommentRepository, 'listForCover').mockResolvedValue(
      controllerSuccess({ data: threadApi }),
    )
    wrapper = mount(CoverCommentsDialog)

    useCoverComments().coverComments.open(cover)
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.find('.dialog-header').text()).toContain(
      t('cover_comments_dialog.title', { author: cover.author.username }),
    )
    expect(CommentRepository.listForCover).toHaveBeenCalledWith({
      params: CommentDto.toThreadParams(
        {
          type: COMMENT_TARGETS.COVER,
          coverId: cover.id,
        },
        1,
      ),
    })
    expect(wrapper.findAll('.comment-card')).toHaveLength(threadApi.comments.length)
  })

  it('hands the new total of comments to the cover in the store', async () => {
    const { covers, coverStore } = useCoverStore()
    const cover = coverSeeder.getCover()
    vi.spyOn(CommentRepository, 'listForCover').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )
    coverStore.setNovelCovers(coverSeeder.getNovelCovers())
    wrapper = mount(CoverCommentsDialog)
    useCoverComments().coverComments.open(cover)
    await flushPromises()

    useCommentStore().commentStore.setCommentCount(cover.commentCount + 1)
    await flushPromises()

    expect(covers.value[0].commentCount).toBe(cover.commentCount + 1)
  })
})
