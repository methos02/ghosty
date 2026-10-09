import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('hasOption', () => {
    it('hasOption is false for an unknown option', () => {
      expect(formStore.hasOption('missing')).toBe(false)
    })
  })
})
