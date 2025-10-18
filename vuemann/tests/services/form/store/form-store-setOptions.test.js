import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})  

describe('formStore.setOptions', () => {
  it('devrait définir les options', () => {
    formStore.setOptions({ foo: 'bar' })
    expect(formStore.getOptions()).toEqual({ foo: 'bar' })
  })
})

