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

  describe('addFlash', () => {
    it('addFlash appends a flash with the given type', () => {
      flashStore.addFlash('Hello', 'success')

      const flashes = flashStore.getFlashes()
      expect(flashes).toHaveLength(1)
      expect(flashes[0]).toMatchObject({ content: 'Hello', type: 'success', autodelete: true })
    })
  })
})
