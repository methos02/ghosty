import { describe, it, expect } from 'vitest'
import { formServiceInternal } from '@/services/form/form-service.js'

describe('form-service', () => {
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
})
