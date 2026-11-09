import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CommentForm from '@/views/comments/CommentForm.vue'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { form, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('CommentForm.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useCommentStore().commentStore.clear()
    form.clearErrors()
    useAuthStore().clear()
    useAuth().closeDialogs()
    vi.clearAllMocks()
  })

  it('offers a visitor to sign in instead of the form', async () => {
    wrapper = mount(CommentForm, { props: { target: commentSeeder.getChapterTarget() } })

    await wrapper.find('.comment-form__login').trigger('click')

    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.find('.comment-form__login').text()).toBe(t('comment_form.login'))
    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('publishes the comment, puts it on top of the thread and empties the fields', async () => {
    const target = commentSeeder.getChapterTarget()
    const formData = commentSeeder.getCreateForm({ isSpoiler: true })
    const createdApi = commentSeeder.getCreatedApi(commentSeeder.getCommentApi({ id: 99 }))
    const loaded = commentSeeder.getComments(1)
    vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue({
      status: STATUS.CREATED,
      data: createdApi,
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { comments, commentCount, commentStore } = useCommentStore()
    commentStore.addComments(loaded)
    wrapper = mount(CommentForm, { props: { target } })

    await wrapper.find('textarea[name="comment.content"]').setValue(formData.content)
    await wrapper.find('input[name="comment.isSpoiler"]').setValue(formData.isSpoiler)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(CommentRepository.createOnChapter).toHaveBeenCalledWith({
      params: CommentDto.toTargetParams(target),
      body: CommentDto.toCreate(formData),
      form: 'comment',
    })
    expect(comments.value).toEqual([CommentDto.fromShow(createdApi.comment), ...loaded])
    expect(commentCount.value).toBe(CommentDto.fromCommentCount(createdApi))
    expect(wrapper.find('textarea[name="comment.content"]').element.value).toBe('')
    expect(wrapper.find('input[name="comment.isSpoiler"]').element.checked).toBe(false)
  })

  it('does not publish a comment left empty', async () => {
    vi.spyOn(CommentRepository, 'createOnChapter')
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(CommentForm, { props: { target: commentSeeder.getChapterTarget() } })

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(CommentRepository.createOnChapter).not.toHaveBeenCalled()
    expect(form.getError('comment.content')).toBe('comment_fields.error_content_required')
  })

  it('keeps the typed text when the api refuses the comment', async () => {
    const formData = commentSeeder.getCreateForm()
    vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue({
      status: STATUS.UNPROCESSABLE_ENTITY,
      data: commentSeeder.getValidationErrorsApi(),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(CommentForm, { props: { target: commentSeeder.getChapterTarget() } })

    await wrapper.find('textarea[name="comment.content"]').setValue(formData.content)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('textarea[name="comment.content"]').element.value).toBe(formData.content)
    expect(useCommentStore().comments.value).toEqual([])
  })
})
