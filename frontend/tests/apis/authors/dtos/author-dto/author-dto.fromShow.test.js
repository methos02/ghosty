import { describe, it, expect } from 'vitest'
import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('author-dto', () => {
  describe('fromShow', () => {
    it('maps the public identity of the author', () => {
      const authorApi = commentSeeder.getCommentApi().author

      expect(AuthorDto.fromShow(authorApi)).toStrictEqual({
        id: authorApi.id,
        username: authorApi.username,
        slug: authorApi.slug,
        profileSlug: authorApi.profile_slug,
        isDeleted: authorApi.is_deleted,
      })
    })
  })
})
