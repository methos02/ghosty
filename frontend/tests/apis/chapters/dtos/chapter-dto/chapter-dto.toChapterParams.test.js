import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

describe('chapter-dto', () => {
  describe('toChapterParams', () => {
    it('builds the chapter id param', () => {
      expect(ChapterDto.toChapterParams(10)).toEqual({ chapter: 10 })
    })
  })
})
