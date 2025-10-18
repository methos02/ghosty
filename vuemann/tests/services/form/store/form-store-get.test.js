import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})


describe('formStore.get', () => {
  it('devrait retourner une instance du store', () => {
    const store = formStore.get()
    expect(store).toBeDefined()
    expect(store.errors).toBeDefined()
    expect(store.options).toBeDefined()
  })
}) 
