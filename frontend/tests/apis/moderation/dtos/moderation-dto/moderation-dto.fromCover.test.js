import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('fromCover', () => {
    it('maps the cover with its author and the novel it was proposed for', () => {
      const coverApi = moderationSeeder.getModeratedCoverApi()

      expect(ModerationDto.fromCover(coverApi)).toEqual({
        id: coverApi.id,
        imageUrl: coverApi.image_url,
        isHidden: false,
        likeCount: coverApi.like_count,
        author: {
          id: coverApi.author.id,
          username: coverApi.author.username,
        },
        novel: NovelDto.fromSummary(coverApi.novel),
      })
    })

    it('flags a cover hidden by the moderation', () => {
      const coverApi = moderationSeeder.getModeratedCoverApi({ is_hidden: true })

      expect(ModerationDto.fromCover(coverApi).isHidden).toBe(true)
    })
  })
})
