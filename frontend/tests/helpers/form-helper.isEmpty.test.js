import { describe, it, expect } from 'vitest'
import { FormHelper } from '@/helpers/form-helper.js'

describe('FormHelper.isEmpty', () => {
  it('returns true for empty string', () => {
    expect(FormHelper.isEmpty('')).toBe(true)
  })

  it('returns true for null', () => {
    expect(FormHelper.isEmpty(null)).toBe(true)
  })

  it('returns true for undefined', () => {
    expect(FormHelper.isEmpty(undefined)).toBe(true)
  })

  it('returns true for an empty array', () => {
    expect(FormHelper.isEmpty([])).toBe(true)
  })

  it('returns true for an empty object', () => {
    expect(FormHelper.isEmpty({})).toBe(true)
  })

  it('returns false for a non-empty string', () => {
    expect(FormHelper.isEmpty('hello')).toBe(false)
  })

  it('returns false for a non-empty array', () => {
    expect(FormHelper.isEmpty([1])).toBe(false)
  })

  it('returns false for a non-empty object', () => {
    expect(FormHelper.isEmpty({ key: 'value' })).toBe(false)
  })

  it('returns false for a number', () => {
    expect(FormHelper.isEmpty(0)).toBe(false)
    expect(FormHelper.isEmpty(42)).toBe(false)
  })
})
