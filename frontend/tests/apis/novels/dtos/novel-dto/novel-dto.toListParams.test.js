import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'

describe('novel-dto', () => {
  describe('toListParams', () => {
    it('carries the page and the searched term', () => {
      expect(NovelDto.toListParams({ page: 4, search: 'virage' })).toEqual({
        page: 4,
        search: 'virage',
      })
    })
  })
})
