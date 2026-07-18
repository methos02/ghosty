const STORAGE_KEY = 'vuemann.tabSessionId'

// Builds a RFC 4122 v4 UUID from crypto.getRandomValues.
// Unlike crypto.randomUUID, getRandomValues works outside secure contexts
// (HTTP via LAN IP / custom hostname), so the dev server keeps working.
const UUID_BYTE_COUNT = 16
const HEX_RADIX = 16
const HEX_PAIR_LENGTH = 2
const VERSION_BYTE_INDEX = 6
const VARIANT_BYTE_INDEX = 8
const VERSION_4 = 0x40
const VERSION_MASK = 0x0f
const VARIANT_RFC4122 = 0x80
const VARIANT_MASK = 0x3f

const generateUuidV4 = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(UUID_BYTE_COUNT))
  bytes[VERSION_BYTE_INDEX] = (bytes[VERSION_BYTE_INDEX] & VERSION_MASK) | VERSION_4
  bytes[VARIANT_BYTE_INDEX] = (bytes[VARIANT_BYTE_INDEX] & VARIANT_MASK) | VARIANT_RFC4122

  const hex = [...bytes]
    .map(byte => byte.toString(HEX_RADIX).padStart(HEX_PAIR_LENGTH, '0'))
    .join('')
  return hex.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
}

const tabSessionId = () => {
  const existing = sessionStorage.getItem(STORAGE_KEY)
  if (existing) {
    return existing
  }

  const generated = generateUuidV4()
  sessionStorage.setItem(STORAGE_KEY, generated)
  return generated
}

export const tabsHelper = { tabSessionId }
