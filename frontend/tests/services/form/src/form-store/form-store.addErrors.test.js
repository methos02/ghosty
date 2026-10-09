import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('addErrors', () => {
    it('addErrors registers several errors at once', () => {
      formStore.addErrors({ email: 'field_required', password: 'field_min' })

      expect(formStore.getErrors()).toEqual({ email: 'field_required', password: 'field_min' })
    })
  })
})
