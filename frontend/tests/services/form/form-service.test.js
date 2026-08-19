import { describe, it, expect, beforeEach } from 'vitest'
import { formService, formServiceInternal } from '@/services/form/form-service.js'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-service', () => {
  beforeEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('toInputName', () => {
    it('scopes a flat field with the form it belongs to', () => {
      expect(formServiceInternal.toInputName('title', 'novel')).toBe('novel.title')
    })

    it('camel cases a snake cased field', () => {
      expect(formServiceInternal.toInputName('genre_id', 'novel')).toBe('novel.genreId')
    })

    it('reads the scope from a dotted field instead of the form', () => {
      expect(formServiceInternal.toInputName('chapter.title', 'novel')).toBe('chapter.title')
    })

    it('camel cases the field of a dotted key', () => {
      expect(formServiceInternal.toInputName('chapter.is_draft', 'novel')).toBe('chapter.isDraft')
    })
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
