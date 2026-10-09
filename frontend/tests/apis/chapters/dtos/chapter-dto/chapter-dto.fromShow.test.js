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
        paragraphs: ['La voiture avait quitté la route au troisième virage...'],
        depth: 0,
        hasChildren: false,
        childrenCount: 0,
        likeCount: 41,
        branchLikeCount: 41,
        isLiked: false,
        isReported: false,
        commentCount: 0,
        isDraft: false,
        isCorrectable: true,
        isRoot: true,
        novel: { id: 1, slug: 'nuit-virage', title: 'Nuit virage', genreId: 3 },
        author: { id: 7, username: 'GhostWriter' },
        publishedAt: '2026-07-31T10:00:00+00:00',
      })
    })

    it('cuts the content into paragraphs, whatever the line endings', () => {
      const api = chapterSeeder.getChapterApi({
        content: 'Premier bloc.\r\n\r\nDeuxième bloc.\n\n\nTroisième.',
      })

      expect(ChapterDto.fromShow(api).paragraphs).toEqual([
        'Premier bloc.',
        'Deuxième bloc.',
        'Troisième.',
      ])
    })

    it('leaves the content undefined when the api omits it', () => {
      const api = chapterSeeder.getChapterApi()
      delete api.content

      expect(ChapterDto.fromShow(api).content).toBeUndefined()
    })

    it('exposes a chapter that has been continued', () => {
      const api = chapterSeeder.getChapterApi({ has_children: true, children_count: 2 })

      const result = ChapterDto.fromShow(api)

      expect(result.hasChildren).toBe(true)
      expect(result.childrenCount).toBe(2)
    })
  })
})
