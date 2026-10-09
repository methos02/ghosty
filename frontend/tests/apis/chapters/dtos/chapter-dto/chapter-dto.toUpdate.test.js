import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('toUpdate', () => {
    it('leaves the parent out, a published chapter never changes branch', () => {
      const formData = chapterSeeder.getWriteForm()

      expect(ChapterDto.toUpdate(formData)).toEqual({
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
      })
    })
  })
})
