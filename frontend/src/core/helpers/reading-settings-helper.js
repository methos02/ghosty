import { ConfigLoader } from '@/config/config-loader.js'
import { ssrStorage } from '@/core/helpers/ssr-storage.js'

const defaults = () => ({
  width: ConfigLoader.get('reading.width.default'),
  fontSize: ConfigLoader.get('reading.fontSize.default'),
  fontFamily: ConfigLoader.get('reading.fontFamily.default'),
  nightMode: ConfigLoader.get('reading.nightMode.default'),
})

const fontFamilyClass = value => {
  return `reading-font-${value}`
}

const fontSizes = () => {
  const range = ConfigLoader.get('reading.fontSize')
  const sizes = []

  for (let size = range.min; size <= range.max; size += range.step) {
    sizes.push(size)
  }

  return sizes
}

const read = () => {
  const stored = ssrStorage.getItem(ConfigLoader.get('reading.storageKey'))
  if (!stored) {
    return defaults()
  }

  return sanitize(readingSettingsHelperInternal.parse(stored))
}

const sanitize = (settings = {}) => ({
  width: readingSettingsHelperInternal.clampToRange(settings.width, 'reading.width'),
  fontSize: readingSettingsHelperInternal.clampToRange(settings.fontSize, 'reading.fontSize'),
  fontFamily: readingSettingsHelperInternal.knownFontFamily(settings.fontFamily),
  nightMode: settings.nightMode === true,
})

const textStyle = settings => ({
  maxWidth: `max(${settings.width}vw, ${ConfigLoader.get('reading.width.minPixels')}px)`,
  fontSize: `${settings.fontSize}px`,
})

const write = settings => {
  ssrStorage.setItem(ConfigLoader.get('reading.storageKey'), JSON.stringify(settings))
}

export const readingSettingsHelper = {
  defaults,
  fontFamilyClass,
  fontSizes,
  read,
  sanitize,
  textStyle,
  write,
}

const clampToRange = (value, configPath) => {
  const number = Number(value)
  if (Number.isNaN(number)) {
    return ConfigLoader.get(`${configPath}.default`)
  }

  const min = ConfigLoader.get(`${configPath}.min`)
  const max = ConfigLoader.get(`${configPath}.max`)

  return Math.min(Math.max(number, min), max)
}

const knownFontFamily = value => {
  const available = ConfigLoader.get('reading.fontFamily.available')
  if (available.some(font => font.value === value)) {
    return value
  }

  return ConfigLoader.get('reading.fontFamily.default')
}

const parse = stored => {
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export const readingSettingsHelperInternal = {
  clampToRange,
  knownFontFamily,
  parse,
}
