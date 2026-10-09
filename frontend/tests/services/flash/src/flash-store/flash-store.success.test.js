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

  describe('success', () => {
    it('success and warning add their respective types', () => {
      flashStore.success('ok')
      flashStore.warning('careful')

      const types = flashStore.getFlashes().map(flash => flash.type)
      expect(types).toEqual(['success', 'warning'])
    })
  })
})
