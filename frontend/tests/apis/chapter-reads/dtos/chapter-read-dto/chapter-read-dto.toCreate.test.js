import { describe, it, expect } from 'vitest'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'

describe('chapter-read-dto', () => {
  describe('toCreate', () => {
    it('sends the reading session under the api name', () => {
      expect(ChapterReadDto.toCreate(chapterReadSeeder.getSessionKey())).toEqual({
        session_key: chapterReadSeeder.getSessionKey(),
      })
    })
  })
})
