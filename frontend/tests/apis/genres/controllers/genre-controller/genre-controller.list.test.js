import { describe, it, expect, vi, afterEach } from 'vitest'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { GenreRepository } from '@/apis/genres/repositories/genre-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'

describe('genre-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('returns the mapped genres on success', async () => {
      vi.spyOn(GenreRepository, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: genreSeeder.getGenresApi(3),
      })

      const result = await GenreController.list()

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.genres).toEqual(genreSeeder.getGenres(3))
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(GenreRepository, 'list').mockResolvedValue(failure)

      expect(await GenreController.list()).toBe(failure)
    })
  })
})
