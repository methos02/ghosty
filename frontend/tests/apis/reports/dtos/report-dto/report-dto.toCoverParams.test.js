import { describe, it, expect } from 'vitest'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('report-dto', () => {
  describe('toCoverParams', () => {
    it('targets the reported cover in the url', () => {
      const cover = coverSeeder.getCover()

      expect(ReportDto.toCoverParams(cover.id)).toEqual({ cover: cover.id })
    })
  })
})
