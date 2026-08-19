import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

const getGenreApi = (overrides = {}) => ({
  id: 3,
  name: 'Fantastique',
  slug: 'fantastique',
  ...overrides,
})

const getGenresApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getGenreApi({
      id: index + 1,
      name: `Genre ${index + 1}`,
      slug: `genre-${index + 1}`,
    }),
  )
}

const getGenres = (count = 3) => GenreDto.fromList(getGenresApi(count))

export const genreSeeder = {
  getGenreApi,
  getGenresApi,
  getGenres,
}
