import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationCommentPage from '@/views/moderation/ModerationCommentPage.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationCommentPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  it('loads the comment of the route with the chapter it was posted on', async () => {
    const moderationCaseApi = moderationSeeder.getCommentCaseApi()
    vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-comment', params: { id: moderationCaseApi.comment.id } })

    wrapper = mount(ModerationCommentPage)
    await flushPromises()

    expect(ModerationRepository.showComment).toHaveBeenCalledWith({
      params: ModerationDto.toCommentParams(moderationCaseApi.comment.id),
    })
    expect(wrapper.find('.moderation-comment-page__content').text()).toBe(
      moderationCaseApi.comment.content,
    )
    expect(wrapper.find('.moderation-comment-page__target').text()).toBe(
      t('moderation_comment_page.on_chapter', {
        chapter: moderationCaseApi.comment.chapter.title,
        novel: moderationCaseApi.comment.novel.title,
      }),
    )
  })

  it('offers to dismiss the reports or to hide the comment', async () => {
    const moderationCaseApi = moderationSeeder.getCommentCaseApi()
    vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-comment', params: { id: moderationCaseApi.comment.id } })

    wrapper = mount(ModerationCommentPage)
    await flushPromises()

    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual([
      RESOLUTIONS.DISMISSED,
      RESOLUTIONS.HIDDEN,
    ])
  })

  it('offers to restore a hidden comment instead of a new decision', async () => {
    const moderationCaseApi = moderationSeeder.getCommentCaseApi({
      comment: moderationSeeder.getModeratedCommentApi({ is_hidden: true }),
    })
    vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-comment', params: { id: moderationCaseApi.comment.id } })

    wrapper = mount(ModerationCommentPage)
    await flushPromises()

    expect(wrapper.find('.moderation-restore-button').exists()).toBe(true)
    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })

  it('offers no decision on a comment its author deleted', async () => {
    const moderationCaseApi = moderationSeeder.getCommentCaseApi({
      comment: moderationSeeder.getModeratedCommentApi({
        content: null,
        is_deleted: true,
      }),
    })
    vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-comment', params: { id: moderationCaseApi.comment.id } })

    wrapper = mount(ModerationCommentPage)
    await flushPromises()

    expect(wrapper.find('.moderation-comment-page__deleted').text()).toBe(
      t('moderation_comment_page.deleted'),
    )
    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })
})
