import { describe, it, expect } from 'vitest'
import { wordHelper } from '@brugmann/vuemann/src/helpers/word-helper.js'

describe('wordHelper', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(wordHelper.capitalize('test')).toBe('Test')
      expect(wordHelper.capitalize('tEST')).toBe('Test')
      expect(wordHelper.capitalize('Test')).toBe('Test')
    })

    it('should handle single-letter strings', () => {
      expect(wordHelper.capitalize('a')).toBe('A')
      expect(wordHelper.capitalize('A')).toBe('A')
    })

    it('should handle empty strings', () => {
      expect(wordHelper.capitalize()).toBe('')
      expect(wordHelper.capitalize('')).toBe('')
    })
  })

  describe('normalize', () => {
    it('should remove diacritics and convert to lowercase', () => {
      expect(wordHelper.normalize('Éléphant')).toBe('elephant')
      expect(wordHelper.normalize('ÀÇÜéèêô')).toBe('acueeeo')
    })

    it('should work with already normalized strings', () => {
      expect(wordHelper.normalize('hello')).toBe('hello')
    })

    it('should handle mixed case and accents', () => {
      expect(wordHelper.normalize('ÇaFÉ')).toBe('cafe')
    })
  })
})
