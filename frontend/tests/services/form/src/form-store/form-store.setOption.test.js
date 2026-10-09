import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('setOption', () => {
    it('setOption / getOption / hasOption work together', () => {
      formStore.setOption('form', 'register')

      expect(formStore.hasOption('form')).toBe(true)
      expect(formStore.getOption('form')).toBe('register')
    })
  })
})
