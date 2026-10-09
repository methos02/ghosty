import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-dto', () => {
  describe('fromShow', () => {
    it('maps API snake_case fields to camelCase view model', () => {
      const api = novelSeeder.getNovelApi()

      const result = NovelDto.fromShow(api)

      expect(result).toEqual({
        id: api.id,
        slug: api.slug,
        title: api.title,
        coverUrl: api.cover_url,
        isFavorite: api.is_favorite,
        chaptersCount: api.chapters_count,
        author: { id: api.author.id, username: api.author.username },
        genre: { id: api.genre.id, label: api.genre.name },
      })
    })

    it('delegates author mapping to AuthorDto', () => {
      const api = novelSeeder.getNovelApi({ author: { id: 99, username: 'Ecrivain' } })

      const result = NovelDto.fromShow(api)

      expect(result.author).toEqual({ id: 99, username: 'Ecrivain' })
    })

    it('delegates genre mapping to GenreDto (name -> label)', () => {
      const api = novelSeeder.getNovelApi({ genre: { id: 5, name: 'Horreur' } })

      const result = NovelDto.fromShow(api)

      expect(result.genre).toEqual({ id: 5, label: 'Horreur' })
    })
  })
})
