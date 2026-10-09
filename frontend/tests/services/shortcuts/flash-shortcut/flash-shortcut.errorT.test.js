import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { t } from '@/services/shortcuts/services-shortcut.js'

describe('flash-shortcut', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    flash.clearFlashes()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('errorT', () => {
    it('errorT translates the key, adds an error flash and returns false', () => {
      const result = flash.errorT('errors.load_failed')

      expect(result).toBe(false)
      const last = flash.getFlashes().at(-1)
      expect(last.type).toBe('error')
      expect(last.content).toBe(t('errors.load_failed'))
    })
  })
})
