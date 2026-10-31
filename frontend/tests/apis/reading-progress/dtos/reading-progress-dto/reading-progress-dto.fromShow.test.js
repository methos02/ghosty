import { describe, it, expect } from 'vitest'
import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { readingProgressSeeder } from '&/utils/seeders/reading-progress-seeder.js'

describe('reading-progress-dto', () => {
  describe('fromShow', () => {
    it('maps the chapter to resume and the day it was read', () => {
      const api = readingProgressSeeder.getReadingProgressApi()

      expect(ReadingProgressDto.fromShow(api)).toEqual({
        chapter: ChapterDto.fromShow(api.chapter),
        readAt: api.read_at,
        readAtFormat: dateHelper.formatDateLocal(api.read_at, 'DD/MM/YYYY'),
      })
    })
  })
})
