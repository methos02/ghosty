import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})  

describe('formStore.hasError', () => {
  it('devrait retourner true si une erreur existe pour un champ', () => {
    formStore.addError('email', 'Erreur')
    expect(formStore.hasError('email')).toBe(true)
  })

  it('devrait retourner false si aucune erreur n\'existe pour un champ', () => {
    expect(formStore.hasError('notfound')).toBe(false)
  })
}) 
