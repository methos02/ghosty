import { describe, it, expect } from 'vitest'
import { localeService } from '@/services/locale/locale-service.js'

describe('locale-service', () => {
  describe('getCurrentLocale', () => {
    it('returns the stored locale', () => {
      localStorage.setItem('locale', 'en')

      expect(localeService.getCurrentLocale()).toBe('en')
    })

    it('falls back to "fr" and stores it when none is set', () => {
      localStorage.removeItem('locale')

      expect(localeService.getCurrentLocale()).toBe('fr')
      expect(localStorage.getItem('locale')).toBe('fr')
    })
  })
})
