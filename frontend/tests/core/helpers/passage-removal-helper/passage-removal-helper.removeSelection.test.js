import { describe, it, expect } from 'vitest'
import { passageRemovalHelper } from '@/core/helpers/passage-removal-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('passage-removal-helper', () => {
  describe('removeSelection', () => {
    it('replaces the selected passage by the removed passage marker', () => {
      const marker = ConfigLoader.get('moderation.removedPassageMarker')

      expect(
        passageRemovalHelper.removeSelection('Avant. Injure. Après.', { start: 7, end: 14 }),
      ).toBe(`Avant. ${marker} Après.`)
    })

    it('keeps the markers of an earlier removal', () => {
      const marker = ConfigLoader.get('moderation.removedPassageMarker')
      const text = `${marker} Reste. Injure.`
      const start = text.indexOf('Injure.')

      expect(passageRemovalHelper.removeSelection(text, { start, end: text.length })).toBe(
        `${marker} Reste. ${marker}`,
      )
    })
  })
})
