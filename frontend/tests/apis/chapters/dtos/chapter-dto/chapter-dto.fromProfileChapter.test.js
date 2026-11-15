import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('fromProfileChapter', () => {
    it('adds the read count and the main branch mark to the chapter', () => {
      const chapterApi = chapterSeeder.getProfileChapterApi()

      expect(ChapterDto.fromProfileChapter(chapterApi)).toEqual({
        ...ChapterDto.fromShow(chapterApi),
        readCount: chapterApi.read_count,
        isInMainBranch: chapterApi.is_in_main_branch,
      })
    })
  })
})
