import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromOfficialCoverId', () => {
    it('reads the official cover of the novel from the response', () => {
      const storedCoverApi = coverSeeder.getStoredCoverApi()

      expect(CoverDto.fromOfficialCoverId(storedCoverApi)).toBe(storedCoverApi.official_cover_id)
    })

    it('leaves the official cover unset when the novel has none', () => {
      const storedCoverApi = coverSeeder.getStoredCoverApi({ official_cover_id: null })

      expect(CoverDto.fromOfficialCoverId(storedCoverApi)).toBeUndefined()
    })
  })
})
