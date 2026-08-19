import { utilsH } from '@/core/helpers/utils-helper.js'

const has = name => {
  if (utilsH.isSsr() || globalThis.document === undefined) {
    return false
  }

  return document.cookie.split('; ').some(cookie => cookie.startsWith(`${name}=`))
}

export const cookieHelper = {
  has,
}
