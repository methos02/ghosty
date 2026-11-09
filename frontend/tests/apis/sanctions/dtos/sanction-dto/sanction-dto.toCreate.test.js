import { describe, it, expect } from 'vitest'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { SANCTION_TYPES } from '@/constants/moderation-constants.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('sanction-dto', () => {
  describe('toCreate', () => {
    it('sends the chosen sanction with its duration and reason', () => {
      const sanction = {
        type: SANCTION_TYPES.WRITE_BAN,
        days: 7,
        reason: moderationSeeder.getSanctionReason(),
      }

      expect(SanctionDto.toCreate(sanction)).toEqual(sanction)
    })

    it('sends no sanction when the moderator chose none', () => {
      expect(SanctionDto.toCreate({ type: undefined, reason: '' })).toBeUndefined()
    })
  })
})
