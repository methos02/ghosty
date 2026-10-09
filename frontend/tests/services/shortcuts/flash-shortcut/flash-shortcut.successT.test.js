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

  describe('successT', () => {
    it('successT adds a success flash with the translated content', () => {
      flash.successT('novels.created')

      const last = flash.getFlashes().at(-1)
      expect(last.type).toBe('success')
      expect(last.content).toBe(t('novels.created'))
    })
  })
})
