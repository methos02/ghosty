import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('clearError', () => {
    it('clearError removes a single error', () => {
      formStore.addErrors({ email: 'e1', password: 'e2' })

      formStore.clearError('email')

      expect(formStore.hasError('email')).toBe(false)
      expect(formStore.hasError('password')).toBe(true)
    })
  })
})
