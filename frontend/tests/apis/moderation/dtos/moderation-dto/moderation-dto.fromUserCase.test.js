import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('fromUserCase', () => {
    it('maps the profile of the account with its reports and its sanctions', () => {
      const moderationCaseApi = moderationSeeder.getUserCaseApi()

      expect(ModerationDto.fromUserCase(moderationCaseApi)).toEqual({
        user: UserDto.fromProfile(moderationCaseApi.user),
        reports: ReportDto.fromList(moderationCaseApi.reports),
        authorSanctions: SanctionDto.fromList(moderationCaseApi.author_sanctions),
      })
    })
  })
})
