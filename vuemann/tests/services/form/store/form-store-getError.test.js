import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { describe, it, expect, beforeEach, afterEach   } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  formStore.clearErrors()
})

describe('formStore.getError', () => {
  it('devrait retourner l\'erreur pour un champ donné', () => {
    formStore.addError('password', 'Mot de passe requis')
    const error = formStore.getError('password')
    expect(error).toBe('Mot de passe requis')
  })
}) 
