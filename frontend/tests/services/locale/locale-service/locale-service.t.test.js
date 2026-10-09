import { describe, it, expect } from 'vitest'
import { localeService } from '@/services/locale/locale-service.js'
import { localeFunctions } from '@/services/locale/src/locale-functions.js'

describe('locale-service', () => {
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
})
