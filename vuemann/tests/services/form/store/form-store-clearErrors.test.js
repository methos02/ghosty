import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})

describe('formStore.clearErrors', () => {
  it('devrait supprimer toutes les erreurs', () => {
    formStore.addError('email', 'Email invalide')
    formStore.addError('password', 'Mot de passe requis')
    expect(formStore.hasError('email')).toBe(true)
    expect(formStore.hasError('password')).toBe(true)
    
    formStore.clearErrors()
    const errors = formStore.getErrors()
    expect(Object.keys(errors).length).toBe(0)
  })
}) 
