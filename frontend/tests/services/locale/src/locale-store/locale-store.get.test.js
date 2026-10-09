import { describe, it, expect, afterEach } from 'vitest'
import { localeStore } from '@/services/locale/src/locale-store.js'

describe('locale-store', () => {
  afterEach(() => {
    localeStore.set('fr')
  })

  describe('get', () => {
    it('get returns the current locale', () => {
      localeStore.set('en')

      expect(localeStore.get()).toBe('en')
    })
  })
})
