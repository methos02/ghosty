import { describe, it, expect, afterEach } from 'vitest'
import { formStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('setOptions', () => {
    it('setOptions replaces the whole options object', () => {
      formStore.setOption('form', 'login')

      formStore.setOptions({ theme: 'dark' })

      expect(formStore.getOptions()).toEqual({ theme: 'dark' })
    })
  })
})
