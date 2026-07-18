/* eslint-disable no-magic-numbers */
const INAMI_LONG_LENGTH = 11
const BASE_LENGTH = 6
const CHECK_LENGTH = 2

const inami = string => {
  const sanitizedNumber = string.replaceAll(/[.\-\s]/g, '')
  if (!/^\d+$/.test(sanitizedNumber) || sanitizedNumber.length !== INAMI_LONG_LENGTH) {
    return 'inami_invalid'
  }

  return isValidCheckDigit(
    sanitizedNumber.slice(0, BASE_LENGTH),
    sanitizedNumber.slice(BASE_LENGTH, BASE_LENGTH + CHECK_LENGTH),
  )
    ? ''
    : 'inami_invalid'
}

const isValidCheckDigit = (baseDigits, checkDigits) => {
  const base = Number(baseDigits)
  const check = Number(checkDigits)

  return 97 - (base % 97) === check || 89 - (base % 89) === check
}

export const inamiTests = { inami }
export const inamiTestsInternal = { isValidCheckDigit }
/* eslint-enable no-magic-numbers */
