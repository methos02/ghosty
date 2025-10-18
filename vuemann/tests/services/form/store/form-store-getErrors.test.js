import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})

describe('formStore.getErrors', () => {
  it('devrait retourner toutes les erreurs', () => {
    formStore.addError('username', 'Nom d\'utilisateur requis')
    const errors = formStore.getErrors()
    expect(errors.username).toBe('Nom d\'utilisateur requis')
    expect(typeof errors).toBe('object')
  })
}) 
