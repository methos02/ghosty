import { describe, it, expect } from 'vitest'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('pagination-dto', () => {
  describe('fromMeta', () => {
    it('maps Laravel meta to the view pagination model', () => {
      const meta = paginationSeeder.getMetaApi()

      const result = PaginationDto.fromMeta(meta)

      expect(result).toEqual({
        page: 1,
        nextPage: 2,
        size: 15,
        total: 45,
        lastPage: 3,
      })
    })

    it('derives nextPage as current_page + 1', () => {
      const meta = paginationSeeder.getMetaApi({ current_page: 3, last_page: 5 })

      const result = PaginationDto.fromMeta(meta)

      expect(result.page).toBe(3)
      expect(result.nextPage).toBe(4)
    })
  })
})
