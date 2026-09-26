import { describe, it, expect } from 'vitest'
import { flashFunctions } from '@/services/flash/src/flash-functions.js'

describe('flash-functions', () => {
  describe('generateFlashId', () => {
    it('hands out a new id on every call, without asking for a secure context', () => {
      const first = flashFunctions.generateFlashId()
      const second = flashFunctions.generateFlashId()

      expect(first).not.toBe(second)
    })
  })
})
