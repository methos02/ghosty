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

  describe('removeFlash', () => {
    it('removeFlash hides then splices the flash after the animation delay', () => {
      flashStore.addFlash('Hello')
      const { id } = flashStore.getFlashes()[0]

      flashStore.removeFlash(id)
      expect(flashStore.getFlashes()[0].hide).toBe(true)

      vi.advanceTimersByTime(350)
      expect(flashStore.hasFlash(id)).toBe(false)
    })
  })
})
