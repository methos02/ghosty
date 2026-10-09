import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('addError', () => {
    it('addError / getError / hasError work together', () => {
      formStore.addError('email', 'field_required')

      expect(formStore.hasError('email')).toBe(true)
      expect(formStore.getError('email')).toBe('field_required')
    })

    it('prefixes the input name with the active form option', () => {
      formStore.setOption('form', 'login')

      formStore.addError('email', 'field_required')

      expect(formStore.getError('login.email')).toBe('field_required')
      expect(formStore.getError('email')).toBeUndefined()
    })
  })
})
