import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('formStore.getOptions', () => {
  it('devrait retourner toutes les options', () => {
    formStore.setOption('foo', 'bar')
    
    const options = formStore.getOptions()
    expect(options.foo).toBe('bar')
    expect(typeof options).toBe('object')
  })
}) 
