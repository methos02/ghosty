import { describe, it, expect } from 'vitest'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('sanction-dto', () => {
  describe('fromShow', () => {
    it('maps a temporary sanction with its end date', () => {
      const sanctionApi = moderationSeeder.getSanctionApi()

      expect(SanctionDto.fromShow(sanctionApi)).toEqual({
        id: sanctionApi.id,
        type: sanctionApi.type,
        isPermanent: false,
        untilFormat: dateHelper.formatDateLocal(sanctionApi.until),
        reason: sanctionApi.reason,
        createdAtFormat: dateHelper.formatDateLocal(sanctionApi.created_at),
      })
    })

    it('tells a sanction without end date is permanent', () => {
      const sanction = SanctionDto.fromShow(moderationSeeder.getSanctionApi({ until: null }))

      expect(sanction.isPermanent).toBe(true)
      expect(sanction.untilFormat).toBe('')
    })

    it('reads a sanction given without reason as an empty reason', () => {
      expect(
        SanctionDto.fromShow(moderationSeeder.getSanctionApi({ reason: null })).reason,
      ).toBe('')
    })
  })
})
