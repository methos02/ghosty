import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

describe('chapter-dto', () => {
  describe('toCreateParams', () => {
    it('builds the novel slug param', () => {
      expect(ChapterDto.toCreateParams('nuit-virage')).toEqual({ slug: 'nuit-virage' })
    })
  })
})
