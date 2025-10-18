import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})


describe('formStore.setOption', () => {
  it('devrait définir une option pour un nom donné', () => {
    formStore.setOption('theme', 'dark')
    const options = formStore.getOptions()
    expect(options.theme).toBe('dark')
  })
}) 
