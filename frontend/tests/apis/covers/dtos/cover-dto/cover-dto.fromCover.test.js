import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromCover', () => {
    it('maps the cover with its author and its likes', () => {
      const coverApi = coverSeeder.getCoverApi()

      expect(CoverDto.fromCover(coverApi)).toEqual({
        id: coverApi.id,
        novelId: coverApi.novel_id,
        imageUrl: coverApi.image_url,
        likeCount: coverApi.like_count,
        commentCount: coverApi.comment_count,
        isLiked: coverApi.is_liked,
        isReported: coverApi.is_reported,
        author: {
          id: coverApi.author.id,
          username: coverApi.author.username,
        },
        createdAtFormat: dateHelper.formatDateLocal(coverApi.created_at, 'DD/MM/YYYY'),
      })
    })
  })
})
