import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

describe('chapter-dto', () => {
  describe('toMainBranchParams', () => {
    it('builds the novel slug param', () => {
      expect(ChapterDto.toMainBranchParams('nuit-virage')).toEqual({ slug: 'nuit-virage' })
    })
  })
})
