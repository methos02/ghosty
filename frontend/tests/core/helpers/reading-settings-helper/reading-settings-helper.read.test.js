import { describe, it, expect, afterEach } from 'vitest'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-helper', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('read', () => {
    it('returns the defaults when the reader has never set anything', () => {
      expect(readingSettingsHelper.read()).toEqual(readingSettingsHelper.defaults())
    })

    it('returns what the reader saved on a previous visit', () => {
      readingSettingsHelper.write({
        width: 60,
        fontSize: 24,
        fontFamily: 'lato',
        nightMode: true,
      })

      expect(readingSettingsHelper.read().fontFamily).toBe('lato')
    })

    it('falls back on the defaults when the stored settings are unreadable', () => {
      localStorage.setItem(ConfigLoader.get('reading.storageKey'), '{ not json')

      expect(readingSettingsHelper.read()).toEqual(readingSettingsHelper.defaults())
    })
  })
})
