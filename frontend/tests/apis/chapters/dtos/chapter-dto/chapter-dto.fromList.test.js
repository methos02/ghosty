import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('fromList', () => {
    it('maps every chapter of the branch', () => {
      const result = ChapterDto.fromList(chapterSeeder.getMainBranchApi(3))

      expect(result).toHaveLength(3)
      expect(result[2].title).toBe('Chapitre 3')
      expect(result[2].depth).toBe(2)
    })

    it('returns an empty array when no chapter is given', () => {
      expect(ChapterDto.fromList()).toEqual([])
    })
  })
})
