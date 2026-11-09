import { describe, it, expect } from 'vitest'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('report-dto', () => {
  describe('toCommentParams', () => {
    it('targets the reported comment in the url', () => {
      const comment = commentSeeder.getComment()

      expect(ReportDto.toCommentParams(comment.id)).toEqual({ comment: comment.id })
    })
  })
})
