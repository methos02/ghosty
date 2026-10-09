import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-dto', () => {
  describe('fromList', () => {
    it('maps each novel in the list', () => {
      const list = novelSeeder.getNovelsApi(3)

      const result = NovelDto.fromList(list)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Roman 1')
      expect(result[2].slug).toBe('roman-3')
    })

    it('returns an empty array when called without argument', () => {
      expect(NovelDto.fromList()).toEqual([])
    })
  })
})
