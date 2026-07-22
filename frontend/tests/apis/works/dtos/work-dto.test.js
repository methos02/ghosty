import { describe, it, expect } from 'vitest'
import { WorkDto } from '@/apis/works/dtos/work-dto.js'
import { workSeeder } from '&/utils/seeders/work-seeder.js'

describe('work-dto', () => {
  describe('fromShow', () => {
    it('maps API fields and resolves type 1 to "chapter"', () => {
      const api = workSeeder.getWorkApi({ type: 1 })

      const result = WorkDto.fromShow(api)

      expect(result).toEqual({
        id: api.id,
        title: api.title,
        content: api.content,
        order: api.order,
        type: 'chapter',
        novelId: api.novel_id,
      })
    })

    it('resolves any non-1 type to "cover"', () => {
      const result = WorkDto.fromShow(workSeeder.getWorkApi({ type: 2 }))

      expect(result.type).toBe('cover')
    })
  })

  describe('fromList', () => {
    it('maps each work in the list', () => {
      const result = WorkDto.fromList(workSeeder.getWorksApi(2))

      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('chapter')
      expect(result[1].order).toBe(2)
    })

    it('returns an empty array when called without argument', () => {
      expect(WorkDto.fromList()).toEqual([])
    })
  })

  describe('toChapterFilters', () => {
    it('builds the chapter filter payload', () => {
      expect(WorkDto.toChapterFilters('mon-roman', 3)).toEqual({
        novel_slug: 'mon-roman',
        order: 3,
        type: 1,
      })
    })
  })

  describe('toShowParams', () => {
    it('wraps the id', () => {
      expect(WorkDto.toShowParams(10)).toEqual({ id: 10 })
    })
  })

  describe('toCreate', () => {
    it('maps camelCase view model to API payload', () => {
      const payload = WorkDto.toCreate({ title: 'T', content: 'C', novelId: 5 })

      expect(payload).toEqual({ title: 'T', content: 'C', novel_id: 5 })
    })
  })

  describe('toUpdate', () => {
    it('keeps only editable fields', () => {
      const payload = WorkDto.toUpdate({ title: 'T', content: 'C', novelId: 5 })

      expect(payload).toEqual({ title: 'T', content: 'C' })
    })
  })

  describe('toVote', () => {
    it('wraps the vote value', () => {
      expect(WorkDto.toVote(1)).toEqual({ value: 1 })
      expect(WorkDto.toVote(-1)).toEqual({ value: -1 })
    })
  })
})
