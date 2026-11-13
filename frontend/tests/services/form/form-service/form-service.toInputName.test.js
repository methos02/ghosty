import { describe, it, expect } from 'vitest'
import { internals } from '@/services/form/form-service.js'

describe('form-service', () => {
  describe('toInputName', () => {
    it('scopes a flat field with the form it belongs to', () => {
      expect(internals.toInputName('title', 'novel')).toBe('novel.title')
    })

    it('camel cases a snake cased field', () => {
      expect(internals.toInputName('genre_id', 'novel')).toBe('novel.genreId')
    })

    it('reads the scope from a dotted field instead of the form', () => {
      expect(internals.toInputName('chapter.title', 'novel')).toBe('chapter.title')
    })

    it('camel cases the field of a dotted key', () => {
      expect(internals.toInputName('chapter.is_draft', 'novel')).toBe('chapter.isDraft')
    })
  })
})
