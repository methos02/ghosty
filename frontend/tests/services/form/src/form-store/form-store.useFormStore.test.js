import { describe, it, expect, afterEach } from 'vitest'
import { formStore, useFormStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('useFormStore', () => {
    it('exposes the reactive errors ref', () => {
      const { errors } = useFormStore()

      formStore.addError('email', 'field_required')

      expect(errors.value).toEqual({ email: 'field_required' })
    })
  })
})
