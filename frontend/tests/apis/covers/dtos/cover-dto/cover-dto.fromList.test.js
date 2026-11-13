import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromList', () => {
    it('maps the covers, the official cover and the cover of the reader', () => {
      const listApi = coverSeeder.getListApi({ my_cover_id: 6 })

      expect(CoverDto.fromList(listApi)).toEqual({
        covers: CoverDto.fromCovers(listApi.covers),
        officialCoverId: listApi.official_cover_id,
        myCoverId: listApi.my_cover_id,
      })
    })

    it('leaves the official cover and the cover of the reader unset when the novel has none', () => {
      const listApi = coverSeeder.getListApi({
        covers: [],
        official_cover_id: null,
      })

      expect(CoverDto.fromList(listApi)).toEqual({
        covers: [],
        officialCoverId: undefined,
        myCoverId: undefined,
      })
    })
  })
})
