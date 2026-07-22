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
        author: { id: api.author.id, pseudo: api.author.pseudo },
        genre: { id: api.genre.id, label: api.genre.name },
      })
    })

    it('delegates author mapping to AuthorDto', () => {
      const api = novelSeeder.getNovelApi({ author: { id: 99, pseudo: 'Ecrivain' } })

      const result = NovelDto.fromShow(api)

      expect(result.author).toEqual({ id: 99, pseudo: 'Ecrivain' })
    })

    it('delegates genre mapping to GenreDto (name -> label)', () => {
      const api = novelSeeder.getNovelApi({ genre: { id: 5, name: 'Horreur' } })

      const result = NovelDto.fromShow(api)

      expect(result.genre).toEqual({ id: 5, label: 'Horreur' })
    })
  })

  describe('fromList', () => {
    it('maps each novel in the list', () => {
      const list = novelSeeder.getNovelsApi(3)

      const result = NovelDto.fromList(list)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Roman 1')
      expect(result[2].slug).toBe('roman-3')
    })

    it('returns an empty array when called without argument', () => {
      expect(NovelDto.fromList()).toEqual([])
    })
  })

  describe('toListParams', () => {
    it('wraps the page number', () => {
      expect(NovelDto.toListParams(4)).toEqual({ page: 4 })
    })
  })

  describe('toShowParams', () => {
    it('wraps the slug', () => {
      expect(NovelDto.toShowParams('mon-roman')).toEqual({ slug: 'mon-roman' })
    })
  })
})
