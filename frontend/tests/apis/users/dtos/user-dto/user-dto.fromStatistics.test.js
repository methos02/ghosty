import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromStatistics', () => {
    it('maps the reads, likes, continuations and contributions of the user', () => {
      const statisticsApi = userSeeder.getStatisticsApi()

      expect(UserDto.fromStatistics(statisticsApi)).toEqual({
        readCount: statisticsApi.read_count,
        likeCount: statisticsApi.like_count,
        receivedContinuationCount: statisticsApi.received_continuation_count,
        novelCount: statisticsApi.novel_count,
        chapterCount: statisticsApi.chapter_count,
        coverCount: statisticsApi.cover_count,
        officialCoverCount: statisticsApi.official_cover_count,
      })
    })
  })
})
