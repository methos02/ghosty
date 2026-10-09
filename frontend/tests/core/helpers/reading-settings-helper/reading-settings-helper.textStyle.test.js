import { describe, it, expect, afterEach } from 'vitest'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-helper', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('textStyle', () => {
    it('measures the text against the window, with a floor for the small screens', () => {
      const floor = ConfigLoader.get('reading.width.minPixels')

      const style = readingSettingsHelper.textStyle({ width: 60, fontSize: 24 })

      expect(style).toEqual({ maxWidth: `max(60vw, ${floor}px)`, fontSize: '24px' })
    })
  })
})
