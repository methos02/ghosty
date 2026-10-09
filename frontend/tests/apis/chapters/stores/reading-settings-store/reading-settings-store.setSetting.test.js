import { describe, it, expect, afterEach } from 'vitest'
import { createReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-store', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('setSetting', () => {
    it('setSetting changes one setting and leaves the others alone', () => {
      const store = createReadingSettingsStore()

      store.setSetting('fontFamily', 'nunito')

      expect(store.settings.value.fontFamily).toBe('nunito')
      expect(store.settings.value.fontSize).toBe(ConfigLoader.get('reading.fontSize.default'))
    })

    it('refuses a setting the panel could not have produced', () => {
      const store = createReadingSettingsStore()

      store.setSetting('width', 400)

      expect(store.settings.value.width).toBe(ConfigLoader.get('reading.width.max'))
    })
  })
})
