import { describe, it, expect, afterEach } from 'vitest'
import { useFormStore } from '@/services/form/src/form-store.js'

describe('form-store', () => {
  const formState = useFormStore()
  const errors = formState.errors
  const options = formState.options
  const formStore = formState.formStore

  afterEach(() => {
    formStore.clearErrors()
    formStore.clearOptions()
  })

  describe('errors', () => {
    it('addError / getError / hasError work together', () => {
      formStore.addError('email', 'field_required')

      expect(formStore.hasError('email')).toBe(true)
      expect(formStore.getError('email')).toBe('field_required')
    })

    it('hasError without argument reflects whether any error exists', () => {
      expect(formStore.hasError()).toBe(false)

      formStore.addError('email', 'field_required')

      expect(formStore.hasError()).toBe(true)
    })

    it('prefixes the input name with the active form option', () => {
      formStore.setOption('form', 'login')

      formStore.addError('email', 'field_required')

      expect(formStore.getError('login.email')).toBe('field_required')
      expect(formStore.getError('email')).toBeUndefined()
    })

    it('addErrors registers several errors at once', () => {
      formStore.addErrors({ email: 'field_required', password: 'field_min' })

      expect(formStore.getErrors()).toEqual({ email: 'field_required', password: 'field_min' })
    })

    it('clearError removes a single error', () => {
      formStore.addErrors({ email: 'e1', password: 'e2' })

      formStore.clearError('email')

      expect(formStore.hasError('email')).toBe(false)
      expect(formStore.hasError('password')).toBe(true)
    })

    it('clearErrors removes every error', () => {
      formStore.addErrors({ email: 'e1', password: 'e2' })

      formStore.clearErrors()

      expect(formStore.getErrors()).toEqual({})
    })

    it('exposes the reactive errors ref', () => {
      formStore.addError('email', 'field_required')

      expect(errors.value).toEqual({ email: 'field_required' })
    })
  })

  describe('options', () => {
    it('setOption / getOption / hasOption work together', () => {
      formStore.setOption('form', 'register')

      expect(formStore.hasOption('form')).toBe(true)
      expect(formStore.getOption('form')).toBe('register')
    })

    it('hasOption is false for an unknown option', () => {
      expect(formStore.hasOption('missing')).toBe(false)
    })

    it('setOptions replaces the whole options object', () => {
      formStore.setOption('form', 'login')

      formStore.setOptions({ theme: 'dark' })

      expect(formStore.getOptions()).toEqual({ theme: 'dark' })
    })

    it('clearOptions empties the options', () => {
      formStore.setOption('form', 'login')

      formStore.clearOptions()

      expect(formStore.getOptions()).toEqual({})
      expect(options.value).toEqual({})
    })
  })
})
