import { describe, it, expect } from 'vitest'
import { mentionHelper } from '@/core/helpers/mention-helper.js'

describe('mention-helper', () => {
  describe('split', () => {
    it('splits the mention of a known reader from the rest of the text', () => {
      expect(mentionHelper.split('@Lectrice Bien vu.', ['GhostWriter', 'Lectrice'])).toEqual({
        mention: '@Lectrice',
        rest: 'Bien vu.',
      })
    })

    it('keeps the longest username when several open the text', () => {
      expect(mentionHelper.split('@Jean Dupont Bien vu.', ['Jean', 'Jean Dupont'])).toEqual({
        mention: '@Jean Dupont',
        rest: 'Bien vu.',
      })
    })

    it('finds no mention of a reader absent from the list', () => {
      expect(mentionHelper.split('@Inconnu Bien vu.', ['Lectrice'])).toEqual({
        mention: '',
        rest: '@Inconnu Bien vu.',
      })
    })

    it('finds no mention when the username only opens a longer word', () => {
      expect(mentionHelper.split('@Jeanne Bien vu.', ['Jean'])).toEqual({
        mention: '',
        rest: '@Jeanne Bien vu.',
      })
    })

    it('finds no mention that does not open the text', () => {
      expect(mentionHelper.split('Comme dit @Lectrice.', ['Lectrice'])).toEqual({
        mention: '',
        rest: 'Comme dit @Lectrice.',
      })
    })
  })
})
