import { describe, it, expect } from 'vitest'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'

describe('follow-dto', () => {
  describe('fromShow', () => {
    it('maps the chapter heading the branch and the follow date', () => {
      const api = followSeeder.getFollowApi()

      expect(FollowDto.fromShow(api)).toEqual({
        chapter: ChapterDto.fromShow(api.chapter),
        followedAt: api.followed_at,
        followedAtFormat: dateHelper.formatDateLocal(api.followed_at, 'DD/MM/YYYY'),
      })
    })
  })
})
