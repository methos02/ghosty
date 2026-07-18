const sanitize = string => {
  if (typeof string !== 'string' || string.length === 0) {
    return ''
  }
  return string.trim().replaceAll(/\s+/g, ' ')
}

const uppercase = string => {
  if (typeof string !== 'string' || string.length === 0) {
    return ''
  }
  return string.toUpperCase()
}

const capitalize = string => {
  if (typeof string !== 'string' || string.length === 0) {
    return ''
  }
  return string[0].toUpperCase() + string.toLowerCase().slice(1)
}

const upperSanitize = string => {
  return wordHelper.uppercase(wordHelper.sanitize(string))
}

const capiSanitize = string => {
  return wordHelper.capitalize(wordHelper.sanitize(string))
}

const normalize = string => {
  return string
    .normalize('NFD')
    .replaceAll(/[\u{300}-\u{36F}]/gu, '')
    .toLowerCase()
}

export const wordHelper = {
  sanitize,
  uppercase,
  capitalize,
  upperSanitize,
  capiSanitize,
  normalize,
}
