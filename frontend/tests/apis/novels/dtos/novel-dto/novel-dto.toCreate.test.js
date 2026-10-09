import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-dto', () => {
  describe('toCreate', () => {
    it('maps the form data to the novel and root chapter payload', () => {
      const formData = novelSeeder.getCreateForm()

      expect(NovelDto.toCreate(formData)).toEqual({
        novel: {
          title: formData.novel.title,
          genre_id: formData.novel.genreId,
        },
        chapter: {
          title: formData.chapter.title,
          content: formData.chapter.content,
          summary: formData.chapter.summary,
          is_draft: undefined,
        },
      })
    })
  })
})
