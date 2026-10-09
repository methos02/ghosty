import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('hasError', () => {
    it('hasError without argument reflects whether any error exists', () => {
      expect(formStore.hasError()).toBe(false)

      formStore.addError('email', 'field_required')

      expect(formStore.hasError()).toBe(true)
    })
  })
})
