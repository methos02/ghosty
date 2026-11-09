import { describe, it, expect } from 'vitest'
import { passageRemovalHelper } from '@/core/helpers/passage-removal-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('passage-removal-helper', () => {
  describe('splitWithPositions', () => {
    it('locates each piece of text and each removed passage in the stored text', () => {
      const marker = ConfigLoader.get('moderation.removedPassageMarker')

      expect(passageRemovalHelper.splitWithPositions(`Avant ${marker} après`)).toEqual([
        {
          text: 'Avant ',
          isRemoved: false,
          start: 0,
          end: 6,
        },
        {
          text: '',
          isRemoved: true,
          start: 6,
          end: 6 + marker.length,
        },
        {
          text: ' après',
          isRemoved: false,
          start: 6 + marker.length,
          end: 12 + marker.length,
        },
      ])
    })

    it('returns no piece for an empty text', () => {
      expect(passageRemovalHelper.splitWithPositions('')).toEqual([])
    })
  })
})
