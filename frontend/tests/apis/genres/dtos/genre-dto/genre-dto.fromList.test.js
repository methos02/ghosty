import { describe, it, expect } from 'vitest'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'

describe('genre-dto', () => {
  describe('fromList', () => {
    it('maps every genre of the list', () => {
      const result = GenreDto.fromList(genreSeeder.getGenresApi(3))

      expect(result).toEqual([
        { id: 1, label: 'Genre 1' },
        { id: 2, label: 'Genre 2' },
        { id: 3, label: 'Genre 3' },
      ])
    })

    it('returns an empty array when no genre is given', () => {
      expect(GenreDto.fromList()).toEqual([])
    })
  })
})
