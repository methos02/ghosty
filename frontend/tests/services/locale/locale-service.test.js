import { describe, it, expect, vi, afterEach } from 'vitest'
import { localeService, localeServiceInternal } from '@/services/locale/locale-service.js'
import { localeFunctions } from '@/services/locale/src/locale-functions.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('locale-service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('t', () => {
    it('returns the declared translation for a key', () => {
      localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {
        test: { title: 'Tous les romans' },
      })

      expect(localeService.t('test.title')).toBe('Tous les romans')
    })

    it('interpolates inline params into the declared translation', () => {
      localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {
        test: { range: 'Entre {min} et {max}' },
      })

      expect(localeService.t('test.range:min=1|max=10')).toBe('Entre 1 et 10')
    })
  })

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

  describe('extractParams', () => {
    it('parses a pipe-separated key=value list', () => {
      expect(localeServiceInternal.extractParams('min=1|max=10')).toEqual({ min: '1', max: '10' })
    })

    it('keeps "=" that belong to the value', () => {
      expect(localeServiceInternal.extractParams('token=a=b=c')).toEqual({ token: 'a=b=c' })
    })

    it('flashes and returns an empty object for an empty string', () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      expect(localeServiceInternal.extractParams('')).toEqual({})
      expect(errorT).toHaveBeenCalledWith('extract_params_empty')
    })

    it('skips and flashes a param that has no value', () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      const result = localeServiceInternal.extractParams('min=1|max=')

      expect(result).toEqual({ min: '1' })
      expect(errorT).toHaveBeenCalledWith('extract_params_missing_value', { key: 'max' })
    })
  })
})
