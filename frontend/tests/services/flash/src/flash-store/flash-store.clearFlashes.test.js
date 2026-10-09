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

  describe('clearFlashes', () => {
    it('clearFlashes empties the list', () => {
      flashStore.addFlash('a')
      flashStore.addFlash('b')

      flashStore.clearFlashes()

      expect(flashStore.getFlashes()).toEqual([])
    })
  })
})
