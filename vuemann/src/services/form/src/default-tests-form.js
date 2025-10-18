import { flash } from "@brugmann/vuemann/src/services/services-helper.js"
import { dateTests } from '@brugmann/vuemann/src/services/form/src/defaultTests/dates-test.js'
import { belgianNumberTests } from '@brugmann/vuemann/src/services/form/src/defaultTests/belgian-number-test.js'

export const tests = {
  required: value => (value ? '' : 'field_required'),
  in: (value, options) => options.options.split(',').includes(value) ? '' : 'field_in:in=' + options.options,
  date: (value, options) => dateTests.date(value, options.options),
  datePast: (value, options) => dateTests.datePast(value, options.options),
  dateFutur: (value, options) => dateTests.dateFutur(value, options.options),
  dateStrictPast: (value, options) => dateTests.dateStrictPast(value, options.options),
  dateStrictFutur: (value, options) => dateTests.dateStrictFutur(value, options.options),
  niss: belgianNumberTests.niss,
  biss: belgianNumberTests.biss,
  integer: value => /^\d+$/.test(value) ? '' : 'field_invalid',
  positive: value => /^\d+$/.test(value) && Number.parseInt(value) >= 0 ? '' : 'field_invalid',
  min: (value, options) => Number.parseInt(value) < Number.parseInt(options.options) ? 'field_min:min=' + options.options : '',
  max: (value, options) => Number.parseInt(value) > Number.parseInt(options.options) ? 'field_max:max=' + options.options : '',
  size: (value, options) => (value.length === Number.parseInt(options.options) ? '' : 'field_size_equal:size=' + options.options),
  sizeMin: (value, options) => value.length < options.options ? 'field_size_min:size=' + options.options : '',
  sizeMax: (value, options) => value.length > options.options ? 'field_size_max:size=' + options.options : '',
  email: value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(value) ? '' : 'field_email',
}

const execute = (test, value, datas) => {
  const [test_name, ...options_array] = test.split(':')
  if (tests[test_name] === undefined) { return flash.error(`Le test "${test_name}" est inconnu.`)}
  return tests[test_name](value, { datas, options : options_array.join(':')})
}

export const defaultTests = { execute }
