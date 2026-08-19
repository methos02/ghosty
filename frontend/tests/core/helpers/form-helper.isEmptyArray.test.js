import { describe, it, expect } from 'vitest'
import { FormHelper } from '@/core/helpers/form-helper.js'

describe('FormHelper.isEmptyArray', () => {
  it('returns true for an empty array', () => {
    expect(FormHelper.isEmptyArray([])).toBe(true)
  })

  it('returns false for a non-empty array', () => {
    expect(FormHelper.isEmptyArray([1, 2, 3])).toBe(false)
  })

  it('returns false for a non-array value', () => {
    expect(FormHelper.isEmptyArray(null)).toBe(false)
    expect(FormHelper.isEmptyArray({})).toBe(false)
    expect(FormHelper.isEmptyArray('')).toBe(false)
  })
})
