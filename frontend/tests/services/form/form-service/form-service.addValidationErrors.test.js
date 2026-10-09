import { describe, it, expect, afterEach } from 'vitest'
import { formService } from '@/services/form/form-service.js'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-service', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('addValidationErrors', () => {
    it('routes each nested key to the form it names', () => {
      formService.addValidationErrors(
        {
          'novel.title': ['titre du roman'],
          'chapter.title': ['titre du chapitre'],
        },
        'novel',
      )

      expect(formStore.getError('novel.title')).toBe('titre du roman')
      expect(formStore.getError('chapter.title')).toBe('titre du chapitre')
    })

    it('falls back on the given form for a flat key', () => {
      formService.addValidationErrors({ content: ['texte réécrit'] }, 'chapter')

      expect(formStore.getError('chapter.content')).toBe('texte réécrit')
    })

    it('does not scope a key twice when a validation ran before', () => {
      formStore.setOptions({ form: 'novel' })

      formService.addValidationErrors({ title: ['titre requis'] }, 'novel')

      expect(formStore.getError('novel.title')).toBe('titre requis')
      expect(formStore.getError('novel.novel.title')).toBeUndefined()
    })
  })
})
