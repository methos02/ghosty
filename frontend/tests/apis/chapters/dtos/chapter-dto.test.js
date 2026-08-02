import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-dto', () => {
  describe('fromShow', () => {
    it('maps the api payload to the view shape', () => {
      const result = ChapterDto.fromShow(chapterSeeder.getChapterApi())

      expect(result).toEqual({
        id: 10,
        novelId: 1,
        parentId: null,
        title: 'Le virage',
        summary: 'Une route de montagne, un virage manqué.',
        content: 'La voiture avait quitté la route au troisième virage...',
        depth: 0,
        isMainChild: false,
        isBranch: false,
        continuationsCount: 0,
        likeCount: 41,
        commentCount: 0,
        author: { id: 7, pseudo: 'GhostWriter' },
        publishedAt: '2026-07-31T10:00:00+00:00',
      })
    })

    it('leaves the content undefined when the api omits it', () => {
      const api = chapterSeeder.getChapterApi()
      delete api.content

      expect(ChapterDto.fromShow(api).content).toBeUndefined()
    })

    it('exposes a continued chapter as a branch', () => {
      const api = chapterSeeder.getChapterApi({ is_branch: true, continuations_count: 2 })

      const result = ChapterDto.fromShow(api)

      expect(result.isBranch).toBe(true)
      expect(result.continuationsCount).toBe(2)
    })
  })

  describe('fromList', () => {
    it('maps every chapter of the continuity', () => {
      const result = ChapterDto.fromList(chapterSeeder.getMainContinuityApi(3))

      expect(result).toHaveLength(3)
      expect(result[2].title).toBe('Chapitre 3')
      expect(result[2].depth).toBe(2)
    })

    it('returns an empty array when no chapter is given', () => {
      expect(ChapterDto.fromList()).toEqual([])
    })
  })

  describe('toMainContinuityParams', () => {
    it('builds the novel slug param', () => {
      expect(ChapterDto.toMainContinuityParams('nuit-virage')).toEqual({ slug: 'nuit-virage' })
    })
  })

  describe('toShowParams', () => {
    it('builds the chapter id param', () => {
      expect(ChapterDto.toShowParams(10)).toEqual({ chapter: 10 })
    })
  })
})
