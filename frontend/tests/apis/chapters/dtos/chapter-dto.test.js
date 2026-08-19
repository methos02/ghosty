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
        isContinued: false,
        continuationsCount: 0,
        likeCount: 41,
        branchLikeCount: 41,
        commentCount: 0,
        isDraft: false,
        isCorrectable: true,
        isRoot: true,
        novel: { id: 1, slug: 'nuit-virage', title: 'Nuit virage', genreId: 3 },
        author: { id: 7, username: 'GhostWriter' },
        publishedAt: '2026-07-31T10:00:00+00:00',
      })
    })

    it('leaves the content undefined when the api omits it', () => {
      const api = chapterSeeder.getChapterApi()
      delete api.content

      expect(ChapterDto.fromShow(api).content).toBeUndefined()
    })

    it('exposes a chapter that has been continued', () => {
      const api = chapterSeeder.getChapterApi({ is_continued: true, continuations_count: 2 })

      const result = ChapterDto.fromShow(api)

      expect(result.isContinued).toBe(true)
      expect(result.continuationsCount).toBe(2)
    })
  })

  describe('fromList', () => {
    it('maps every chapter of the continuity', () => {
      const result = ChapterDto.fromList(chapterSeeder.getCurrentContinuityApi(3))

      expect(result).toHaveLength(3)
      expect(result[2].title).toBe('Chapitre 3')
      expect(result[2].depth).toBe(2)
    })

    it('returns an empty array when no chapter is given', () => {
      expect(ChapterDto.fromList()).toEqual([])
    })
  })

  describe('toCurrentContinuityParams', () => {
    it('builds the novel slug param', () => {
      expect(ChapterDto.toCurrentContinuityParams('nuit-virage')).toEqual({ slug: 'nuit-virage' })
    })
  })

  describe('toChapterParams', () => {
    it('builds the chapter id param', () => {
      expect(ChapterDto.toChapterParams(10)).toEqual({ chapter: 10 })
    })
  })

  describe('toCreateParams', () => {
    it('builds the novel slug param', () => {
      expect(ChapterDto.toCreateParams('nuit-virage')).toEqual({ slug: 'nuit-virage' })
    })
  })

  describe('toCreate', () => {
    it('maps the form data to the API payload, parent included', () => {
      const formData = chapterSeeder.getWriteForm()

      expect(ChapterDto.toCreate(formData)).toEqual({
        parent_id: formData.parentId,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        is_draft: formData.isDraft,
      })
    })
  })

  describe('toUpdate', () => {
    it('leaves the parent out, a published chapter never changes branch', () => {
      const formData = chapterSeeder.getWriteForm()

      expect(ChapterDto.toUpdate(formData)).toEqual({
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
      })
    })
  })
})
