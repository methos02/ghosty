import { describe, it, expect } from 'vitest'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

describe('genre-dto', () => {
  describe('fromShow', () => {
    it('maps id and renames name to label', () => {
      const api = { id: 3, name: 'Fantastique', extra: 'ignored' }

      const result = GenreDto.fromShow(api)

      expect(result).toEqual({ id: 3, label: 'Fantastique' })
    })
  })
})
