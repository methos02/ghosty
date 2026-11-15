import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('toUserParams', () => {
    it('targets the account by its id in the url', () => {
      const userId = moderationSeeder.getUserCaseApi().user.id

      expect(ModerationDto.toUserParams(userId)).toEqual({ user: userId })
    })
  })
})
