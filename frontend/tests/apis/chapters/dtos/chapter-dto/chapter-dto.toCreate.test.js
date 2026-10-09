import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('toCreate', () => {
    it('maps the form data to the API payload, parent included', () => {
      const formData = chapterSeeder.getWriteForm()

      expect(ChapterDto.toCreate(formData)).toEqual({
        parent_id: formData.parentId,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        is_draft: formData.isDraft,
      })
    })
  })
})
