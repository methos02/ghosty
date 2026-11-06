import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CommentReplyForm from '@/views/comments/CommentReplyForm.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('CommentReplyForm.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useCommentStore().commentStore.clear()
    form.clearErrors()
    vi.clearAllMocks()
  })

  it('starts the reply with the mention of the answered reader', () => {
    const mentionedAuthor = commentSeeder.getReply().author

    wrapper = mount(CommentReplyForm, {
      props: { parentComment: commentSeeder.getComment(), mentionedAuthor },
    })

    expect(wrapper.find('textarea[name="reply.content"]').element.value).toBe(
      `@${mentionedAuthor.username} `,
    )
  })

  it('publishes the reply under its parent and tells it was sent', async () => {
    const parentComment = commentSeeder.getCommentWithReply()
    const formData = commentSeeder.getCreateForm()
    const createdApi = commentSeeder.getCreatedApi(commentSeeder.getReplyApi({ id: 71 }))
    vi.spyOn(CommentRepository, 'createReply').mockResolvedValue({
      status: STATUS.CREATED,
      data: createdApi,
    })
    const { comments, commentCount, commentStore } = useCommentStore()
    commentStore.addComments([parentComment])
    const [{ author: mentionedAuthor }] = parentComment.replies
    wrapper = mount(CommentReplyForm, { props: { parentComment, mentionedAuthor } })

    await wrapper.find('textarea[name="reply.content"]').setValue(formData.content)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(CommentRepository.createReply).toHaveBeenCalledWith({
      params: CommentDto.toCommentParams(parentComment.id),
      body: CommentDto.toCreateReply(formData, mentionedAuthor),
    })
    expect(comments.value[0].replies.at(-1)).toEqual(CommentDto.fromShow(createdApi.comment))
    expect(commentCount.value).toBe(CommentDto.fromCommentCount(createdApi))
    expect(wrapper.emitted('sent')).toHaveLength(1)
  })

  it('does not tell the reply was sent when the api refuses it', async () => {
    vi.spyOn(CommentRepository, 'createReply').mockResolvedValue({
      status: STATUS.UNPROCESSABLE_ENTITY,
      data: commentSeeder.getValidationErrorsApi(),
    })
    wrapper = mount(CommentReplyForm, {
      props: {
        parentComment: commentSeeder.getComment(),
        mentionedAuthor: commentSeeder.getComment().author,
      },
    })

    await wrapper
      .find('textarea[name="reply.content"]')
      .setValue(commentSeeder.getCreateForm().content)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.emitted('sent')).toBeUndefined()
  })

  it('asks to be closed when the reader cancels', async () => {
    wrapper = mount(CommentReplyForm, {
      props: {
        parentComment: commentSeeder.getComment(),
        mentionedAuthor: commentSeeder.getComment().author,
      },
    })

    await wrapper.find('.comment-reply-form__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
