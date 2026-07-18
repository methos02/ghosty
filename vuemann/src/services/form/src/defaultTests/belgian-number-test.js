/* eslint-disable no-magic-numbers, unicorn/prefer-string-replace-all */
import { dateTests } from '@brugmann/vuemann/src/services/form/src/defaultTests/dates-test.js'

const niss = string => {
  const sanitizedNumber = string.replace(/[.-]/g, '')
  const hasUnknownBirthDate = sanitizedNumber.slice(2, 6) === '0000'

  if (!hasUnknownBirthDate) {
    const result = dateTests.date(sanitizedNumber.slice(0, 6), 'yymmdd')
    if (result !== '') {
      return 'niss_date'
    }
  }

  return controleCodeCheck(sanitizedNumber) ? 'niss_invalid' : ''
}

const biss = string => {
  const sanitizedNumber = string.replace(/[.-]/g, '')
  const result = dateTests.date(extractBisDate(sanitizedNumber.slice(0, 6)), 'yymmdd')
  if (result !== '') {
    return 'biss_date'
  }

  return controleCodeCheck(sanitizedNumber) ? 'biss_invalid' : ''
}

const passport = string => {
  const sanitizedNumber = string.replace(/\s/g, '')
  return /^[A-Z]{2}\d{7}$/.test(sanitizedNumber) ? '' : 'passport_invalid'
}

export const belgianNumberTests = {
  niss,
  biss,
  passport,
}

const extractBisDate = string => {
  const month = Number(string.slice(2, 4))
  return (
    string.slice(0, 2) +
    (month - (month <= 32 ? 20 : 40)).toString().padStart(2, '0') +
    string.slice(4)
  )
}

const controleCodeCheck = number => {
  const controlCode = Number(number.slice(9, 11))
  return (
    calculControleCode('2' + number.slice(0, 9)) !== controlCode &&
    calculControleCode(number.slice(0, 9)) !== controlCode
  )
}

const calculControleCode = number => 97 - (Number(number) % 97)
/* eslint-enable no-magic-numbers, unicorn/prefer-string-replace-all */
