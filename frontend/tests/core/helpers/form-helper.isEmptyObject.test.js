import { describe, it, expect } from 'vitest'
import { FormHelper } from '@/core/helpers/form-helper.js'

describe('FormHelper.isEmptyObject', () => {
  it('returns true for an empty plain object', () => {
    expect(FormHelper.isEmptyObject({})).toBe(true)
  })

  it('returns false for a non-empty object', () => {
    expect(FormHelper.isEmptyObject({ key: 'value' })).toBe(false)
  })

  it('returns false for an array (even empty)', () => {
    expect(FormHelper.isEmptyObject([])).toBe(false)
  })

  it('returns false for a number', () => {
    expect(FormHelper.isEmptyObject(42)).toBe(false)
  })
})
