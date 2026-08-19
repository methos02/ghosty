import { describe, it, expect } from 'vitest'
import { FormHelper } from '@/core/helpers/form-helper.js'

describe('FormHelper.getInputName', () => {
  it('returns the input name unchanged when no form name is provided', () => {
    expect(FormHelper.getInputName('email')).toBe('email')
  })

  it('returns a dot-separated name when a form name is provided', () => {
    expect(FormHelper.getInputName('email', 'user')).toBe('user.email')
  })

  it('returns the input name unchanged when form name is explicitly undefined', () => {
    expect(FormHelper.getInputName('phone', undefined)).toBe('phone')
  })
})
