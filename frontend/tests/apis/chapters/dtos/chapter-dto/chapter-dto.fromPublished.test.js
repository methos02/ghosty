import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('fromPublished', () => {
    it('pairs each novel with the chapters written in it', () => {
      const [novelApi] = chapterSeeder.getPublishedApi().novels

      const result = ChapterDto.fromPublished([novelApi])

      expect(result).toEqual([
        {
          novel: NovelDto.fromShow(novelApi),
          chapters: ChapterDto.fromList(novelApi.chapters),
        },
      ])
    })
  })
})
