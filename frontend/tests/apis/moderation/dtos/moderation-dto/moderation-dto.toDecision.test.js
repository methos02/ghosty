import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { RESOLUTIONS, SANCTION_TYPES } from '@/constants/moderation-constants.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('toDecision', () => {
    it('sends the text left after removing passages', () => {
      const formData = moderationSeeder.getDecisionForm({
        resolution: RESOLUTIONS.PASSAGE_REMOVED,
        content: moderationSeeder.getContentAfterRemoval(),
      })

      expect(ModerationDto.toDecision(formData)).toEqual({
        resolution: RESOLUTIONS.PASSAGE_REMOVED,
        content: formData.content,
        sanction: undefined,
      })
    })

    it('leaves the text out of any other resolution', () => {
      expect(
        ModerationDto.toDecision(
          moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.HIDDEN }),
        ).content,
      ).toBeUndefined()
    })

    it('sends the chosen sanction with its duration and reason', () => {
      const sanctionApi = moderationSeeder.getSanctionApi()
      const sanction = {
        type: SANCTION_TYPES.COMMENT_BAN,
        days: 30,
        reason: sanctionApi.reason,
      }

      expect(
        ModerationDto.toDecision(moderationSeeder.getDecisionForm({ sanction })).sanction,
      ).toEqual(sanction)
    })
  })
})
