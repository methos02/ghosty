import { describe, it, expect, afterEach } from 'vitest'
import { createReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('reading-settings-store', () => {
  afterEach(() => {
    localStorage.clear()
  })

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

  it('restore picks up the comfort of the previous visit', () => {
    readingSettingsHelper.write({ width: 60, fontSize: 24, fontFamily: 'roboto', nightMode: true })
    const store = createReadingSettingsStore()

    store.restore()

    expect(store.settings.value.fontFamily).toBe('roboto')
  })

  it('persist keeps the comfort for the next visit', () => {
    const store = createReadingSettingsStore()
    store.setSetting('nightMode', true)

    store.persist()

    expect(readingSettingsHelper.read().nightMode).toBe(true)
  })
})
