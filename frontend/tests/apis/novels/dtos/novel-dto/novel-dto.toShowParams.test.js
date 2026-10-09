import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'

describe('novel-dto', () => {
  describe('toShowParams', () => {
    it('wraps the slug', () => {
      expect(NovelDto.toShowParams('mon-roman')).toEqual({ slug: 'mon-roman' })
    })
  })
})
