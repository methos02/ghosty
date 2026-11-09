import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { REPORT_STATUSES } from '@/constants/moderation-constants.js'

describe('moderation-dto', () => {
  describe('toListParams', () => {
    it('sends the status, the reason and the page of the queue', () => {
      expect(
        ModerationDto.toListParams({ status: REPORT_STATUSES.PROCESSED, reason: 'spam' }, 2),
      ).toEqual({
        status: REPORT_STATUSES.PROCESSED,
        reason: 'spam',
        page: 2,
      })
    })
  })
})
