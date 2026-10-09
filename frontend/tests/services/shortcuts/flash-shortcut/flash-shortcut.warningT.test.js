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

  describe('warningT', () => {
    it('warningT adds a warning flash with the translated content', () => {
      flash.warningT('access_denied')

      const last = flash.getFlashes().at(-1)
      expect(last.type).toBe('warning')
      expect(last.content).toBe(t('access_denied'))
    })
  })
})
