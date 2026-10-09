import { describe, it, expect, afterEach } from 'vitest'
import { createReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'

describe('reading-settings-store', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('createReadingSettingsStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createReadingSettingsStore()
      const storeB = createReadingSettingsStore()

      storeA.setSetting('nightMode', true)

      expect(storeB.settings.value.nightMode).toBe(false)
    })

    it('opens on the defaults, the only comfort the server can know', () => {
      const store = createReadingSettingsStore()

      expect(store.settings.value).toEqual(readingSettingsHelper.defaults())
    })
  })
})
