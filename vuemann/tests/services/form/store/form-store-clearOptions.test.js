import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearOptions()
})

describe('form store clear options', () => {

  it('should clear the options', () => {
    formStore.setOption('form', 'test')
    formStore.clearOptions()
    expect(formStore.hasOption('form')).toBe(false)
  })
})
