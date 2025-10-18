/* eslint-disable no-magic-numbers, unicorn/prefer-string-replace-all */
import { dateTests } from '@brugmann/vuemann/src/services/form/src/defaultTests/dates-test.js'

const niss = string => {
  const sanitizedNumber = string.replace(/[.-]/g, '')
  const result = dateTests.date(sanitizedNumber.slice(0, 6), 'yymmdd')
  if (result !== '') { return 'niss_date' }

  return controleCodeCheck(sanitizedNumber) ? 'niss_invalid' : ''
}

const biss = string => {
  const sanitizedNumber = string.replace(/[.-]/g, '')
  const result = dateTests.date(extractBisDate(sanitizedNumber.slice(0, 6)), 'yymmdd')
  if (result !== '') { return 'biss_date' }

  return controleCodeCheck(sanitizedNumber) ? 'biss_invalid' : ''
}

export const belgianNumberTests = {
  niss,
  biss,
}

const extractBisDate = string => {
  const month = Number.parseInt(string.slice(2, 4), 10)
  return ( string.slice(0, 2) + (month - (month <= 32 ? 20 : 40)).toString().padStart(2, '0') + string.slice(4) )
}

const controleCodeCheck = number => {
  const controlCode = Number.parseInt(number.slice(9, 11), 10)
  return ( calculControleCode('2' + number.slice(0, 9)) !== controlCode && calculControleCode(number.slice(0, 9)) !== controlCode )
}

const calculControleCode = number => 97 - (Number.parseInt(number, 10) % 97)
/* eslint-enable no-magic-numbers, unicorn/prefer-string-replace-all */   
