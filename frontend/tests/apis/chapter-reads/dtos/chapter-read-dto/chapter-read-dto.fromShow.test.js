import { describe, it, expect } from 'vitest'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'

describe('chapter-read-dto', () => {
  describe('fromShow', () => {
    it('maps the chapter read and the moment of the reading', () => {
      const api = chapterReadSeeder.getChapterReadApi()

      expect(ChapterReadDto.fromShow(api)).toEqual({
        chapter: ChapterDto.fromShow(api.chapter),
        readAt: api.read_at,
        readAtFormat: dateHelper.formatDateLocal(api.read_at, 'DD/MM/YYYY HH:mm'),
      })
    })
  })
})
