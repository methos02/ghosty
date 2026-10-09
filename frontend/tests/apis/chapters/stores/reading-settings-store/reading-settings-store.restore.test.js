import { describe, it, expect, afterEach } from 'vitest'
import { createReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'

describe('reading-settings-store', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('restore', () => {
    it('restore picks up the comfort of the previous visit', () => {
      readingSettingsHelper.write({
        width: 60,
        fontSize: 24,
        fontFamily: 'roboto',
        nightMode: true,
      })
      const store = createReadingSettingsStore()

      store.restore()

      expect(store.settings.value.fontFamily).toBe('roboto')
    })
  })
})
