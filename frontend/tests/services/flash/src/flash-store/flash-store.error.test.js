import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flashStore } from '@/services/flash/src/flash-store.js'

describe('flash-store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    flashStore.clearFlashes()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('error', () => {
    it('error adds an error flash and returns false', () => {
      const result = flashStore.error('Boom')

      expect(result).toBe(false)
      expect(flashStore.getFlashes()[0].type).toBe('error')
    })
  })
})
