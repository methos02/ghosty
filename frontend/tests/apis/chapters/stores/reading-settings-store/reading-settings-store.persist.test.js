import { describe, it, expect, afterEach } from 'vitest'
import { createReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'

describe('reading-settings-store', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('persist', () => {
    it('persist keeps the comfort for the next visit', () => {
      const store = createReadingSettingsStore()
      store.setSetting('nightMode', true)

      store.persist()

      expect(readingSettingsHelper.read().nightMode).toBe(true)
    })
  })
})
