import { describe, it, expect } from 'vitest'
import { AjaxHelpers } from '@brugmann/vuemann/src/services/ajax/ajax-helpers.js'

describe('ajax-helpers', () => {
  describe('isAuthError', () => {
    it('should return true for 401 status code', () => {
      expect(AjaxHelpers.isAuthError(401)).toBe(true)
    })

    it('should return true for 403 status code', () => {
      expect(AjaxHelpers.isAuthError(403)).toBe(true)
    })

    it('should return false for other status codes', () => {
      expect(AjaxHelpers.isAuthError(200)).toBe(false)
      expect(AjaxHelpers.isAuthError(404)).toBe(false)
      expect(AjaxHelpers.isAuthError(500)).toBe(false)
    })
  })

  describe('isSuccess', () => {
    it('should return true for 200 status code', () => {
      expect(AjaxHelpers.isSuccess(200)).toBe(true)
    })

    it('should return true for 201 status code', () => {
      expect(AjaxHelpers.isSuccess(201)).toBe(true)
    })

    it('should return true for 204 status code', () => {
      expect(AjaxHelpers.isSuccess(204)).toBe(true)
    })

    it('should return true for any 20x status code', () => {
      expect(AjaxHelpers.isSuccess(202)).toBe(true)
      expect(AjaxHelpers.isSuccess(203)).toBe(true)
      expect(AjaxHelpers.isSuccess(205)).toBe(true)
      expect(AjaxHelpers.isSuccess(206)).toBe(true)
    })

    it('should return false for non-20x status codes', () => {
      expect(AjaxHelpers.isSuccess(100)).toBe(false)
      expect(AjaxHelpers.isSuccess(199)).toBe(false)
      expect(AjaxHelpers.isSuccess(300)).toBe(false)
      expect(AjaxHelpers.isSuccess(400)).toBe(false)
      expect(AjaxHelpers.isSuccess(401)).toBe(false)
      expect(AjaxHelpers.isSuccess(404)).toBe(false)
      expect(AjaxHelpers.isSuccess(500)).toBe(false)
    })

    it('should handle string status codes', () => {
      expect(AjaxHelpers.isSuccess('200')).toBe(true)
      expect(AjaxHelpers.isSuccess('201')).toBe(true)
      expect(AjaxHelpers.isSuccess('204')).toBe(true)
      expect(AjaxHelpers.isSuccess('404')).toBe(false)
    })
  })
})
