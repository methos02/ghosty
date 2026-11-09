import { describe, it, expect, afterEach } from 'vitest'
import { validateModerationForm } from '@/apis/moderation/formRequest/moderation-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { RESOLUTIONS, SANCTION_TYPES } from '@/constants/moderation-constants.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateModerationForm', () => {
    it('rejects a decision without resolution as required', () => {
      const validation = validateModerationForm(
        moderationSeeder.getDecisionForm({ resolution: undefined }),
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('moderation.resolution')).toBe(
        'moderation_decision.error_resolution_required',
      )
    })

    it('rejects a passage removal that removes nothing', () => {
      const validation = validateModerationForm(
        moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.PASSAGE_REMOVED }),
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('moderation.content')).toBe('moderation_decision.error_nothing_removed')
    })

    it('accepts a passage removal that removes a passage', () => {
      expect(
        validateModerationForm(
          moderationSeeder.getDecisionForm({
            resolution: RESOLUTIONS.PASSAGE_REMOVED,
            content: moderationSeeder.getContentAfterRemoval(),
          }),
        ).valid,
      ).toBe(true)
    })

    it('accepts any other resolution whatever the text', () => {
      expect(
        validateModerationForm(moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.HIDDEN }))
          .valid,
      ).toBe(true)
    })

    it('rejects a hidden comment without sanction as required', () => {
      const validation = validateModerationForm(
        moderationSeeder.getDecisionForm({
          resolution: RESOLUTIONS.HIDDEN,
          isSanctionRequired: true,
        }),
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('moderation.sanction.type')).toBe(
        'moderation_decision.error_sanction_required',
      )
    })

    it('rejects a sanction without reason as required', () => {
      const validation = validateModerationForm(
        moderationSeeder.getDecisionForm({
          sanction: {
            type: SANCTION_TYPES.WARNING,
          },
        }),
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('moderation.sanction.reason')).toBe(
        'moderation_decision.error_sanction_reason_required',
      )
    })

    it('asks no reason when no sanction is given', () => {
      const validation = validateModerationForm(moderationSeeder.getDecisionForm())

      expect(validation.valid).toBe(true)
    })

    it('rejects a sanction reason one character longer than the configured maximum as too long', () => {
      const reason = 'a'.repeat(ConfigLoader.get('moderation.reasonMaxLength') + 1)

      const validation = validateModerationForm(
        moderationSeeder.getDecisionForm({
          sanction: {
            type: SANCTION_TYPES.WARNING,
            reason,
          },
        }),
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('moderation.sanction.reason')).toBe(
        'moderation_decision.error_sanction_reason_size_max',
      )
    })
  })
})
