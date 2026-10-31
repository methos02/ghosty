import { ConfigLoader } from '@/config/config-loader.js'
import { ssrStorage } from '@/core/helpers/ssr-storage.js'

const UUID_BYTE_COUNT = 16
const HEX_RADIX = 16
const HEX_DIGITS_PER_BYTE = 2
const UUID_GROUPS = /^(.{8})(.{4})(.{4})(.{4})(.{12})$/

const generateUuid = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(UUID_BYTE_COUNT))
  const hex = Array.from(bytes, byte =>
    byte.toString(HEX_RADIX).padStart(HEX_DIGITS_PER_BYTE, '0'),
  ).join('')

  return hex.replace(UUID_GROUPS, '$1-$2-$3-$4-$5')
}

const sessionKey = () => {
  const storageKey = ConfigLoader.get('reading.sessionKeyStorageKey')
  const stored = ssrStorage.getItem(storageKey)
  if (stored) {
    return stored
  }

  const created = generateUuid()
  ssrStorage.setItem(storageKey, created)

  return created
}

export const readingSessionHelper = {
  sessionKey,
}
