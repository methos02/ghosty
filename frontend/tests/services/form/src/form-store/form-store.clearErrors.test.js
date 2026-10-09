import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('clearErrors', () => {
    it('clearErrors removes every error', () => {
      formStore.addErrors({ email: 'e1', password: 'e2' })

      formStore.clearErrors()

      expect(formStore.getErrors()).toEqual({})
    })
  })
})
