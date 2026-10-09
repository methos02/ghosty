import { describe, it, expect, vi, afterEach } from 'vitest'
import { localeServiceInternal } from '@/services/locale/locale-service.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('locale-service', () => {
  afterEach(() => {
    vi.clearAllMocks()
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
