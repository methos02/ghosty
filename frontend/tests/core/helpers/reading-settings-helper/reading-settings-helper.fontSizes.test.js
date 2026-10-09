import { describe, it, expect, afterEach } from 'vitest'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-helper', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('fontSizes', () => {
    it('offers every size between the bounds, by step', () => {
      const range = ConfigLoader.get('reading.fontSize')
      const sizes = readingSettingsHelper.fontSizes()

      expect(sizes.at(0)).toBe(range.min)
      expect(sizes.at(-1)).toBe(range.max)
      expect(sizes[1] - sizes[0]).toBe(range.step)
    })
  })
})
