import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationDecisionForm from '@/views/moderation/parts/ModerationDecisionForm.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { form, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import {
  REPORTED_CONTENT_TYPES,
  RESOLUTIONS,
  SANCTION_TYPES,
} from '@/constants/moderation-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationDecisionForm.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('offers only the resolutions it is given', () => {
    const resolutions = [RESOLUTIONS.DISMISSED, RESOLUTIONS.PASSAGE_REMOVED]
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.CHAPTER,
        contentId: moderationSeeder.getModeratedChapterApi().id,
        resolutions,
      },
    })

    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual(
      resolutions,
    )
  })

  it('hands the chosen resolution to its page', async () => {
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.CHAPTER,
        contentId: moderationSeeder.getModeratedChapterApi().id,
        resolutions: Object.values(RESOLUTIONS),
      },
    })

    await wrapper.find(`input[value="${RESOLUTIONS.PASSAGE_REMOVED}"]`).setValue(true)

    expect(wrapper.emitted('update:resolution')).toEqual([[RESOLUTIONS.PASSAGE_REMOVED]])
  })

  it('asks a duration only for a ban', async () => {
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: moderationSeeder.getModeratedCommentApi().id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })

    await wrapper.find('select[name="moderation.sanction.type"]').setValue(SANCTION_TYPES.WARNING)
    expect(wrapper.find('select[name="moderation.sanction.days"]').exists()).toBe(false)

    await wrapper
      .find('select[name="moderation.sanction.type"]')
      .setValue(SANCTION_TYPES.COMMENT_BAN)
    expect(wrapper.find('select[name="moderation.sanction.days"]').exists()).toBe(true)
  })

  it('sends the chapter left after removing passages once confirmed, then goes back to the queue', async () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    const chapterApi = moderationSeeder.getModeratedChapterApi()
    vi.spyOn(ModerationRepository, 'moderateChapter').mockResolvedValue(controllerSuccess())
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.CHAPTER,
        contentId: chapterApi.id,
        resolutions: Object.values(RESOLUTIONS),
        contentAfterRemoval: moderationSeeder.getContentAfterRemoval(),
      },
    })
    await wrapper.find(`input[value="${RESOLUTIONS.PASSAGE_REMOVED}"]`).setValue(true)

    await wrapper.find('.moderation-decision__submit').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.moderateChapter).toHaveBeenCalledWith({
      params: ModerationDto.toChapterParams(chapterApi.id),
      body: ModerationDto.toDecision(
        moderationSeeder.getDecisionForm({
          resolution: RESOLUTIONS.PASSAGE_REMOVED,
          content: moderationSeeder.getContentAfterRemoval(),
        }),
      ),
      form: 'moderation',
    })
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('moderation'), {
      timeout: 5000,
    })
  })

  it('suggests at least a warning once a comment is hidden', async () => {
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: moderationSeeder.getModeratedCommentApi().id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })

    await wrapper.find(`input[value="${RESOLUTIONS.HIDDEN}"]`).setValue(true)

    const sanctionSelect = wrapper.find('select[name="moderation.sanction.type"]')
    expect(sanctionSelect.element.value).toBe(SANCTION_TYPES.WARNING)
    expect(sanctionSelect.text()).not.toContain(t('moderation_decision.sanction_none'))
  })

  it('sends the hidden comment with the sanction of its author', async () => {
    const commentApi = moderationSeeder.getModeratedCommentApi()
    vi.spyOn(ModerationRepository, 'moderateComment').mockResolvedValue(controllerSuccess())
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: commentApi.id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })
    await wrapper.find(`input[value="${RESOLUTIONS.HIDDEN}"]`).setValue(true)
    await wrapper.find('select[name="moderation.sanction.type"]').setValue(SANCTION_TYPES.WARNING)
    await wrapper
      .find('textarea[name="moderation.sanction.reason"]')
      .setValue(moderationSeeder.getSanctionReason())

    await wrapper.find('.moderation-decision__submit').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.moderateComment).toHaveBeenCalledWith({
      params: ModerationDto.toCommentParams(commentApi.id),
      body: ModerationDto.toDecision(
        moderationSeeder.getDecisionForm({
          resolution: RESOLUTIONS.HIDDEN,
          sanction: {
            type: SANCTION_TYPES.WARNING,
            reason: moderationSeeder.getSanctionReason(),
          },
        }),
      ),
      form: 'moderation',
    })
  })

  it('suggests at least a warning once a cover is hidden', async () => {
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COVER,
        contentId: moderationSeeder.getModeratedCoverApi().id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })

    await wrapper.find(`input[value="${RESOLUTIONS.HIDDEN}"]`).setValue(true)

    const sanctionSelect = wrapper.find('select[name="moderation.sanction.type"]')
    expect(sanctionSelect.element.value).toBe(SANCTION_TYPES.WARNING)
    expect(sanctionSelect.text()).not.toContain(t('moderation_decision.sanction_none'))
  })

  it('sends the hidden cover with the sanction of its author', async () => {
    const coverApi = moderationSeeder.getModeratedCoverApi()
    vi.spyOn(ModerationRepository, 'moderateCover').mockResolvedValue(controllerSuccess())
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COVER,
        contentId: coverApi.id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })
    await wrapper.find(`input[value="${RESOLUTIONS.HIDDEN}"]`).setValue(true)
    await wrapper
      .find('textarea[name="moderation.sanction.reason"]')
      .setValue(moderationSeeder.getSanctionReason())

    await wrapper.find('.moderation-decision__submit').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.moderateCover).toHaveBeenCalledWith({
      params: ModerationDto.toCoverParams(coverApi.id),
      body: ModerationDto.toDecision(
        moderationSeeder.getDecisionForm({
          resolution: RESOLUTIONS.HIDDEN,
          sanction: {
            type: SANCTION_TYPES.WARNING,
            reason: moderationSeeder.getSanctionReason(),
          },
        }),
      ),
      form: 'moderation',
    })
  })

  it('sends nothing while no resolution is chosen', async () => {
    vi.spyOn(ModerationRepository, 'moderateComment')
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: moderationSeeder.getModeratedCommentApi().id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })

    await wrapper.find('.moderation-decision__submit').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ModerationRepository.moderateComment).not.toHaveBeenCalled()
    expect(wrapper.find('#error-moderation\\.resolution').text()).toBe(
      t('moderation_decision.error_resolution_required'),
    )
  })

  it('stays on the case when the decision is refused', async () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    vi.spyOn(ModerationRepository, 'moderateComment').mockResolvedValue(
      controllerError(STATUS.CONFLICT),
    )
    wrapper = mount(ModerationDecisionForm, {
      props: {
        contentType: REPORTED_CONTENT_TYPES.COMMENT,
        contentId: moderationSeeder.getModeratedCommentApi().id,
        resolutions: [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN],
      },
    })
    await wrapper.find(`input[value="${RESOLUTIONS.DISMISSED}"]`).setValue(true)

    await wrapper.find('.moderation-decision__submit').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).not.toBe('moderation')
  })
})
