import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentCard from '@/views/comments/CommentCard.vue'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('CommentCard.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    useAuth().closeDialogs()
    vi.clearAllMocks()
  })

  it('shows the comment followed by its replies', () => {
    const comment = commentSeeder.getCommentWithReply()

    wrapper = mount(CommentCard, { props: { comment } })

    expect(wrapper.findAll('.comment-content__text').map(text => text.text())).toEqual([
      comment.content,
      ...comment.replies.map(reply => reply.content),
    ])
  })

  it('opens the reply form prefilled with the mention of the author of the answered comment', async () => {
    const comment = commentSeeder.getCommentWithReply()
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(CommentCard, { props: { comment } })

    await wrapper.find('.comment-content__reply').trigger('click')

    expect(wrapper.find('.comment-card__reply-form textarea').element.value).toBe(
      `@${comment.author.username} `,
    )
  })

  it('opens the reply form prefilled with the mention of the reader of the answered reply', async () => {
    const comment = commentSeeder.getCommentWithReply()
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(CommentCard, { props: { comment } })

    await wrapper.find('.comment-card__reply .comment-content__reply').trigger('click')

    expect(wrapper.find('.comment-card__reply-form textarea').element.value).toBe(
      `@${comment.replies[0].author.username} `,
    )
  })

  it('highlights the mention of a reader of the thread in a reply', () => {
    const replyApi = commentSeeder.getReplyApi({ content: '@GhostWriter Bien vu.' })
    const comment = CommentDto.fromShow(
      commentSeeder.getCommentWithReplyApi({ reply_count: 1, replies: [replyApi] }),
    )

    wrapper = mount(CommentCard, { props: { comment } })

    expect(wrapper.find('.comment-card__reply .comment-content__mention').text()).toBe(
      `@${comment.author.username}`,
    )
  })

  it('closes the reply form when the reader cancels it', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(CommentCard, { props: { comment: commentSeeder.getComment() } })
    await wrapper.find('.comment-content__reply').trigger('click')

    await wrapper.find('.comment-reply-form__cancel').trigger('click')

    expect(wrapper.find('.comment-card__reply-form').exists()).toBe(false)
  })

  it('invites a visitor to sign in instead of opening the reply form', async () => {
    wrapper = mount(CommentCard, { props: { comment: commentSeeder.getComment() } })

    await wrapper.find('.comment-content__reply').trigger('click')

    expect(wrapper.find('.comment-card__reply-form').exists()).toBe(false)
    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('offers no reply button anywhere in the card of a deleted comment', () => {
    wrapper = mount(CommentCard, { props: { comment: commentSeeder.getDeletedComment() } })

    expect(wrapper.find('.comment-content__reply').exists()).toBe(false)
  })

  it('offers no reply button anywhere in the card of a comment the moderation hid', () => {
    wrapper = mount(CommentCard, { props: { comment: commentSeeder.getHiddenComment() } })

    expect(wrapper.find('.comment-content__reply').exists()).toBe(false)
  })
})
