import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})

describe('formStore.clearError', () => {
  it('devrait supprimer une erreur pour un champ donné', () => {
    formStore.addError('email', 'Email invalide')
    formStore.clearError('email')
    const errors = formStore.getErrors()
    expect(errors.email).toBeUndefined()
  })
}) 
