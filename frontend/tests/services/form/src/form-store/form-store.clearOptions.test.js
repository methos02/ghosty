import { describe, it, expect, afterEach } from 'vitest'
import { formStore, useFormStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('clearOptions', () => {
    it('clearOptions empties the options', () => {
      const { options } = useFormStore()
      formStore.setOption('form', 'login')

      formStore.clearOptions()

      expect(formStore.getOptions()).toEqual({})
      expect(options.value).toEqual({})
    })
  })
})
