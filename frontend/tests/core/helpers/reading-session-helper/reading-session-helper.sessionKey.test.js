import { describe, it, expect, afterEach } from 'vitest'
import { readingSessionHelper } from '@/core/helpers/reading-session-helper.js'

describe('reading-session-helper', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('sessionKey', () => {
    it('creates a key the api accepts as a uuid', () => {
      expect(readingSessionHelper.sessionKey()).toMatch(
        /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/,
      )
    })

    it('keeps the same key for every read of the browser', () => {
      const first = readingSessionHelper.sessionKey()

      expect(readingSessionHelper.sessionKey()).toBe(first)
    })
  })
})
