import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CommentContent from '@/views/comments/CommentContent.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'

describe('CommentContent.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useCommentStore().commentStore.clear()
    flash.clearFlashes()
    useAuthStore().clear()
    useReport().report.closeReport()
    useAuth().closeDialogs()
    vi.clearAllMocks()
  })

  it('shows the author, the date and the text of the comment', () => {
    const comment = commentSeeder.getComment()

    wrapper = mount(CommentContent, { props: { comment } })

    expect(wrapper.find('.comment-content__author').text()).toBe(comment.author.username)
    expect(wrapper.find('.comment-content__date').text()).toBe(comment.createdAtFormat)
    expect(wrapper.find('.comment-content__text').text()).toBe(comment.content)
  })

  it('highlights the mention of a reader of the thread that opens the text', () => {
    const mention = `@${commentSeeder.getComment().author.username}`
    const comment = commentSeeder.getReply({ content: `${mention} Bien vu.` })

    wrapper = mount(CommentContent, {
      props: { comment, threadUsernames: [comment.author.username, mention.slice(1)] },
    })

    expect(wrapper.find('.comment-content__mention').text()).toBe(mention)
    expect(wrapper.find('.comment-content__text').text()).toBe(comment.content)
  })

  it('highlights nothing when the mention names no reader of the thread', () => {
    const comment = commentSeeder.getReply({ content: '@Inconnu Bien vu.' })

    wrapper = mount(CommentContent, {
      props: { comment, threadUsernames: [comment.author.username] },
    })

    expect(wrapper.find('.comment-content__mention').exists()).toBe(false)
  })

  it('hides the text of a spoiler until the reader asks to reveal it', async () => {
    const comment = commentSeeder.getComment({ isSpoiler: true })
    wrapper = mount(CommentContent, { props: { comment } })

    expect(wrapper.find('.comment-content__text').exists()).toBe(false)
    expect(wrapper.find('.comment-content__spoiler').text()).toBe(
      t('comment_content.reveal_spoiler'),
    )

    await wrapper.find('.comment-content__spoiler').trigger('click')

    expect(wrapper.find('.comment-content__text').text()).toBe(comment.content)
  })

  it('shows only a deleted trace for a comment its author removed', () => {
    wrapper = mount(CommentContent, { props: { comment: commentSeeder.getDeletedComment() } })

    expect(wrapper.text()).toBe(t('comment_content.deleted_comment'))
  })

  it('shows only a moderation trace for a comment the moderation hid', () => {
    wrapper = mount(CommentContent, { props: { comment: commentSeeder.getHiddenComment() } })

    expect(wrapper.text()).toBe(t('comment_content.hidden_comment'))
  })

  it('hands the comment of another reader to the report dialog', async () => {
    const comment = commentSeeder.getComment()
    useAuthStore().setUser(userSeeder.getUser({ id: comment.author.id + 1 }))
    wrapper = mount(CommentContent, { props: { comment } })

    await wrapper.find('.comment-content__report').trigger('click')

    expect(useReport().reportedContent.value).toEqual({
      type: REPORTED_CONTENT_TYPES.COMMENT,
      content: comment,
    })
  })

  it('asks a visitor to sign in before reporting a comment', async () => {
    wrapper = mount(CommentContent, { props: { comment: commentSeeder.getComment() } })

    await wrapper.find('.comment-content__report').trigger('click')

    expect(useReport().reportedContent.value).toBeUndefined()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('does not offer the author to report their own comment', () => {
    const comment = commentSeeder.getComment()
    useAuthStore().setUser(userSeeder.getUser({ id: comment.author.id }))

    wrapper = mount(CommentContent, { props: { comment } })

    expect(wrapper.find('.comment-content__report').exists()).toBe(false)
  })

  it('asks to reply when the reader clicks the reply button of a replyable comment', async () => {
    wrapper = mount(CommentContent, {
      props: { comment: commentSeeder.getComment(), isReplyable: true },
    })

    await wrapper.find('.comment-content__reply').trigger('click')

    expect(wrapper.find('.comment-content__reply').text()).toBe(t('comment_content.reply'))
    expect(wrapper.emitted('reply')).toHaveLength(1)
  })

  it('offers no reply button when the comment is not replyable', () => {
    wrapper = mount(CommentContent, { props: { comment: commentSeeder.getComment() } })

    expect(wrapper.find('.comment-content__reply').exists()).toBe(false)
  })

  it('offers no delete button on a comment written by another reader', () => {
    useAuthStore().setUser(userSeeder.getUser())

    wrapper = mount(CommentContent, { props: { comment: commentSeeder.getReply() } })

    expect(wrapper.find('.comment-content__delete').exists()).toBe(false)
  })

  it('deletes an own comment once confirmed, removes it from the thread and confirms', async () => {
    const comment = commentSeeder.getComment()
    const deletedApi = commentSeeder.getDeletedApi()
    vi.spyOn(CommentRepository, 'destroy').mockResolvedValue(
      controllerSuccess({ data: deletedApi }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const { comments, commentCount, commentStore } = useCommentStore()
    commentStore.addComments([comment])
    wrapper = mount(CommentContent, { props: { comment } })

    await wrapper.find('.comment-content__delete').trigger('click')
    expect(CommentRepository.destroy).not.toHaveBeenCalled()
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(CommentRepository.destroy).toHaveBeenCalledWith({
      params: CommentDto.toCommentParams(comment.id),
    })
    expect(comments.value).toEqual([])
    expect(commentCount.value).toBe(CommentDto.fromCommentCount(deletedApi))
    expect(flash.getFlashes().at(-1).content).toBe(t('comment_content.deleted'))
  })

  it('keeps the comment in the thread when the api refuses the deletion', async () => {
    const comment = commentSeeder.getComment()
    vi.spyOn(CommentRepository, 'destroy').mockResolvedValue(controllerError(STATUS.FORBIDDEN))
    useAuthStore().setUser(userSeeder.getUser())
    const { comments, commentStore } = useCommentStore()
    commentStore.addComments([comment])
    wrapper = mount(CommentContent, { props: { comment } })

    await wrapper.find('.comment-content__delete').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(comments.value).toEqual([comment])
  })
})
