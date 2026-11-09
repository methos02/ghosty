import { ref, readonly, inject } from 'vue'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'

export const READING_SETTINGS_STORE_KEY = Symbol('reading-settings-store')

const readingSettingsStore = () => {
  const settings = ref(readingSettingsHelper.defaults())

  const setSettings = value => {
    settings.value = readingSettingsHelper.sanitize(value)
  }

  const setSetting = (name, value) => {
    setSettings({ ...settings.value, [name]: value })
  }

  const restore = () => {
    settings.value = readingSettingsHelper.read()
  }

  const persist = () => {
    readingSettingsHelper.write(settings.value)
  }

  const serialize = () => ({
    settings: settings.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    settings.value = readingSettingsHelper.sanitize(data.settings)
  }

  return {
    settings: readonly(settings),
    setSettings,
    setSetting,
    restore,
    persist,
    serialize,
    hydrate,
  }
}

export const createReadingSettingsStore = () => readingSettingsStore()

export const useReadingSettingsStore = () => inject(READING_SETTINGS_STORE_KEY)
