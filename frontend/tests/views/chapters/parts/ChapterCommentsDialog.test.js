import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChapterCommentsDialog from '@/views/chapters/parts/ChapterCommentsDialog.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useChapterComments } from '@/core-vue/composables/comments/use-chapter-comments.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/core-vue/stores/chapters/reading-store.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('ChapterCommentsDialog.vue', () => {
  let wrapper

  afterEach(() => {
    useChapterComments().closeChapterComments()
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('does not load any comment while the dialog is closed', async () => {
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )

    wrapper = mount(ChapterCommentsDialog, {
      global: { provide: { [READING_STORE_KEY]: createReadingStore() } },
    })
    await flushPromises()

    expect(CommentRepository.listForChapter).not.toHaveBeenCalled()
    expect(wrapper.find('.comment-thread').exists()).toBe(false)
  })

  it('loads the comments of the chapter the reader opened them on', async () => {
    const chapter = chapterSeeder.getChapter()
    const threadApi = commentSeeder.getThreadApi()
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: threadApi }),
    )
    wrapper = mount(ChapterCommentsDialog, {
      global: { provide: { [READING_STORE_KEY]: createReadingStore() } },
    })

    useChapterComments().openChapterComments(chapter)
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.find('.dialog-header').text()).toContain(chapter.title)
    expect(CommentRepository.listForChapter).toHaveBeenCalledWith({
      params: CommentDto.toThreadParams(
        { type: COMMENT_TARGETS.CHAPTER, chapterId: chapter.id },
        1,
      ),
    })
    expect(wrapper.findAll('.comment-card')).toHaveLength(threadApi.comments.length)
  })

  it('hands the new total of comments to the chapter being read', async () => {
    const chapter = chapterSeeder.getChapter({ commentCount: 2 })
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )
    wrapper = mount(ChapterCommentsDialog, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })
    useChapterComments().openChapterComments(chapter)
    await flushPromises()

    const newTotal = CommentDto.fromCommentCount(commentSeeder.getCreatedApi())
    useCommentStore().commentStore.setCommentCount(newTotal)
    await flushPromises()

    expect(readingStore.chapter.value.commentCount).toBe(newTotal)
  })

  it('drops the thread once the reader closes the dialog', async () => {
    vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
      controllerSuccess({ data: commentSeeder.getThreadApi() }),
    )
    wrapper = mount(ChapterCommentsDialog, {
      global: { provide: { [READING_STORE_KEY]: createReadingStore() } },
    })
    useChapterComments().openChapterComments(chapterSeeder.getChapter())
    await flushPromises()

    useChapterComments().closeChapterComments()
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(false)
    expect(wrapper.find('.comment-thread').exists()).toBe(false)
  })
})
