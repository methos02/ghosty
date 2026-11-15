import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromProfileCovers', () => {
    it('maps every cover of the profile list', () => {
      const coversApi = [
        coverSeeder.getProfileCoverApi(),
        coverSeeder.getProfileCoverApi({
          id: 6,
          is_official: false,
        }),
      ]

      expect(CoverDto.fromProfileCovers(coversApi)).toEqual(
        coversApi.map(coverApi => CoverDto.fromProfileCover(coverApi)),
      )
    })
  })
})
