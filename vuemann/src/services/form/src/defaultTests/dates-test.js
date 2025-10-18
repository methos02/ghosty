const date = (dateString, format) => {
  const result = createDate(dateString, format)
  return (result instanceof Date) ? '' : 'date_invalid'
}

const datePast = (dateString, format) => {
  const dateToTest = createDate(dateString, format)
  if (!(dateToTest instanceof Date)) { return dateToTest }

  const today = new Date().setHours(0, 0, 0, 0)
  dateToTest.setHours(0, 0, 0, 1)

  return dateToTest > today ? 'date_not_past' : ''
}

const dateStrictPast = (dateString, format) => {
  const dateToTest = createDate(dateString, format)
  if (!(dateToTest instanceof Date)) { return dateToTest }

  const today = new Date().setHours(0, 0, 0, 0)
  dateToTest.setHours(0, 0, 0, 1)

  return dateToTest >= today ? 'date_not_past' : ''
}

const dateFutur = (dateString, format) => {
  const dateToTest = createDate(dateString, format)
  if (!(dateToTest instanceof Date)) { return dateToTest }

  const today = new Date().setHours(0, 0, 0, 0)
  dateToTest.setHours(0, 0, 0, 1)

  return dateToTest < today ? 'date_not_futur' : ''
}

const dateStrictFutur = (dateString, format) => {
  const dateToTest = createDate(dateString, format)
  if (!(dateToTest instanceof Date)) { return dateToTest }

  const today = new Date().setHours(0, 0, 0, 0)
  dateToTest.setHours(0, 0, 0, 1)

  return dateToTest <= today ? 'date_not_futur' : ''
}

export const dateTests = {
  date,
  datePast,
  dateStrictPast,
  dateFutur,
  dateStrictFutur,
}

export const createDate = (dateString, format) => {
  const regex = createDateRegexFromFormat(format)
  const dateMatch = dateString.match(regex)
  if (!dateMatch) { return 'date_invalid' }

  const [year, month, day] = defineDateComposents(dateMatch, format)
  const date = new Date(year, month - 1, day)
  return !(date instanceof Date) || date.getMonth() !== month - 1 || date.getDate() !== day ? 'date_invalid' : date
}


const FORMAT_REGEX = {
  yyyy: String.raw`(\d{4})`,
  yy: String.raw`(\d{2})`,
  mm: String.raw`(\d{2})`,
  dd: String.raw`(\d{2})`,
  hh: String.raw`(\d{2})`,
  MM: String.raw`(\d{2})`,
};

const createDateRegexFromFormat = (format) => {
  let regexPattern = format

  for (const [token, pattern] of Object.entries(FORMAT_REGEX)) {
    regexPattern = regexPattern.replaceAll(token, pattern);
  }

  regexPattern = regexPattern.replaceAll('/', String.raw`\/`).replaceAll('-', String.raw`\-`);
  
  return new RegExp(`^${regexPattern}$`)
}

const defineDateComposents = (dateMatch, format) => {
  const order = {
    year: format.indexOf('yyyy') ?? format.indexOf('yyyy'),
    month: format.indexOf('mm'),
    day: format.indexOf('dd'),
  }

  return [order.year, order.month, order.day]
    .map((pos, index) => ({ pos, value: Number.parseInt(dateMatch[index + 1], 10) }))
    .toSorted((a, b) => a.pos - b.pos)
    .map(object => object.value)
}
