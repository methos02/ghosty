import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('getGenreIconClass', () => {
    it('returns the venus icon for "f"', () => {
      expect(utilsH.getGenreIconClass('F')).toBe('fa-solid fa-venus')
      expect(utilsH.getGenreIconClass('f')).toBe('fa-solid fa-venus')
    })

    it('returns the mars icon for "m"', () => {
      expect(utilsH.getGenreIconClass('M')).toBe('fa-solid fa-mars')
    })

    it('returns the neuter icon for anything else', () => {
      expect(utilsH.getGenreIconClass('x')).toBe('fa-solid fa-neuter')
    })

    it('returns an empty string for a falsy value', () => {
      expect(utilsH.getGenreIconClass('')).toBe('')
      expect(utilsH.getGenreIconClass(undefined)).toBe('')
    })
  })
})
