import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { t } from '@/services/shortcuts/services-shortcut.js'

describe('flash shortcut (translated helpers)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    flash.clearFlashes()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('errorT translates the key, adds an error flash and returns false', () => {
    const result = flash.errorT('errors.load_failed')

    expect(result).toBe(false)
    const last = flash.getFlashes().at(-1)
    expect(last.type).toBe('error')
    expect(last.content).toBe(t('errors.load_failed'))
  })

  it('successT adds a success flash with the translated content', () => {
    flash.successT('novels.created')

    const last = flash.getFlashes().at(-1)
    expect(last.type).toBe('success')
    expect(last.content).toBe(t('novels.created'))
  })

  it('warningT adds a warning flash with the translated content', () => {
    flash.warningT('access_denied')

    const last = flash.getFlashes().at(-1)
    expect(last.type).toBe('warning')
    expect(last.content).toBe(t('access_denied'))
  })
})
