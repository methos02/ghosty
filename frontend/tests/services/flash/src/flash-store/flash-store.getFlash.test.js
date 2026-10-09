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

  describe('getFlash', () => {
    it('hasFlash / getFlash locate a flash by id', () => {
      flashStore.addFlash('Hello')
      const { id } = flashStore.getFlashes()[0]

      expect(flashStore.hasFlash(id)).toBe(true)
      expect(flashStore.getFlash(id).content).toBe('Hello')
    })

    it('getFlash returns undefined for an unknown id', () => {
      expect(flashStore.getFlash('unknown-id')).toBeUndefined()
      expect(flashStore.hasFlash('unknown-id')).toBe(false)
    })
  })
})
