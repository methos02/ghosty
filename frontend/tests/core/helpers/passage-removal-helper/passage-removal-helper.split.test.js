import { describe, it, expect } from 'vitest'
import { passageRemovalHelper } from '@/core/helpers/passage-removal-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('passage-removal-helper', () => {
  describe('split', () => {
    it('keeps a paragraph without removed passage as a single piece of text', () => {
      expect(passageRemovalHelper.split('Le phare s’éteint.')).toEqual([
        {
          text: 'Le phare s’éteint.',
          isRemoved: false,
        },
      ])
    })

    it('puts a removed passage between the text around it', () => {
      const marker = ConfigLoader.get('moderation.removedPassageMarker')

      expect(passageRemovalHelper.split(`Avant ${marker} après`)).toEqual([
        {
          text: 'Avant ',
          isRemoved: false,
        },
        {
          text: '',
          isRemoved: true,
        },
        {
          text: ' après',
          isRemoved: false,
        },
      ])
    })

    it('keeps one mention per removed passage when two follow each other', () => {
      const marker = ConfigLoader.get('moderation.removedPassageMarker')

      expect(passageRemovalHelper.split(`${marker}${marker}`)).toEqual([
        {
          text: '',
          isRemoved: true,
        },
        {
          text: '',
          isRemoved: true,
        },
      ])
    })
  })
})
