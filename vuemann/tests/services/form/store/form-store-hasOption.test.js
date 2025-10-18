import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearOptions()
})

describe('form store has option', () => {
  it('should return true if the option exists', () => {
    formStore.setOption('form', 'test')
    expect(formStore.hasOption('form')).toBe(true)
  })

  it('should return false if the option does not exist', () => {
    expect(formStore.hasOption('form')).toBe(false)
  })
})

