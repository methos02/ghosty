import { describe, it, expect } from 'vitest'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('sanction-dto', () => {
  describe('fromSummary', () => {
    it('maps the sanction carried by a notification with its end date', () => {
      const sanctionApi = notificationSeeder.getSanctionApi()

      expect(SanctionDto.fromSummary(sanctionApi)).toEqual({
        type: sanctionApi.type,
        isPermanent: false,
        untilFormat: dateHelper.formatDateLocal(sanctionApi.until),
        reason: sanctionApi.reason,
      })
    })

    it('tells a sanction without end date is permanent', () => {
      const sanction = SanctionDto.fromSummary(notificationSeeder.getSanctionApi({ until: null }))

      expect(sanction.isPermanent).toBe(true)
      expect(sanction.untilFormat).toBe('')
    })
  })
})
