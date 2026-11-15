import { describe, it, expect } from 'vitest'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('report-dto', () => {
  describe('toUserParams', () => {
    it('targets the reported account in the url', () => {
      const profile = userSeeder.getProfile()

      expect(ReportDto.toUserParams(profile.username)).toEqual({ username: profile.username })
    })
  })
})
