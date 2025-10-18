import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('formStore.getOption', () => {
  it('devrait retourner la valeur de l\'option pour un nom donné', () => {
    formStore.setOption('lang', 'fr')
    const value = formStore.getOption('lang')
    expect(value).toBe('fr')
  })
}) 
