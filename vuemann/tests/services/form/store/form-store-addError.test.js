import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})

describe('formStore.addError', () => {
  it('devrait ajouter une erreur pour un champ donné', () => {
    formStore.addError('email', 'Email invalide')
    const errors = formStore.getErrors()
    expect(errors.email).toBe('Email invalide')
  })
}) 
