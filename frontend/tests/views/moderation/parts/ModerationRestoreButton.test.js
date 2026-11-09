import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationRestoreButton from '@/views/moderation/parts/ModerationRestoreButton.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationRestoreButton.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('restores the chapter once the moderator confirms, then goes back to the queue', async () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    const chapterApi = moderationSeeder.getModeratedChapterApi()
    vi.spyOn(ModerationRepository, 'restoreChapter').mockResolvedValue(controllerSuccess())
    wrapper = mount(ModerationRestoreButton, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.CHAPTER,
        contentId: chapterApi.id,
      },
    })

    await wrapper.find('.moderation-restore-button').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.restoreChapter).toHaveBeenCalledWith({
      params: ModerationDto.toChapterParams(chapterApi.id),
    })
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('moderation'), {
      timeout: 5000,
    })
  })

  it('restores a comment through the comment route', async () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    const commentApi = moderationSeeder.getModeratedCommentApi()
    vi.spyOn(ModerationRepository, 'restoreComment').mockResolvedValue(controllerSuccess())
    wrapper = mount(ModerationRestoreButton, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: commentApi.id,
      },
    })

    await wrapper.find('.moderation-restore-button').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.restoreComment).toHaveBeenCalledWith({
      params: ModerationDto.toCommentParams(commentApi.id),
    })
  })

  it('stays on the case when the restoration is refused', async () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    vi.spyOn(ModerationRepository, 'restoreChapter').mockResolvedValue(
      controllerError(STATUS.FORBIDDEN),
    )
    wrapper = mount(ModerationRestoreButton, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.CHAPTER,
        contentId: moderationSeeder.getModeratedChapterApi().id,
      },
    })

    await wrapper.find('.moderation-restore-button').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).not.toBe('moderation')
  })
})
