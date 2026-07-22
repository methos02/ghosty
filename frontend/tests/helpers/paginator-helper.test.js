import { describe, it, expect } from 'vitest'
import { paginatorHelper } from '@/helpers/paginator-helper.js'

describe('paginator-helper', () => {
  describe('calculTotalPage', () => {
    it('rounds up when items do not fill the last page', () => {
      expect(paginatorHelper.calculTotalPage(55, 10)).toBe(6)
    })

    it('returns an exact count when items divide evenly', () => {
      expect(paginatorHelper.calculTotalPage(100, 25)).toBe(4)
    })

    it('returns 0 when there are no items', () => {
      expect(paginatorHelper.calculTotalPage(0, 10)).toBe(0)
    })

    it('handles a page size of 1', () => {
      expect(paginatorHelper.calculTotalPage(5, 1)).toBe(5)
    })
  })
})
