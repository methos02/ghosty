import { describe, it, expect, afterEach } from 'vitest'
import { localeStore } from '@/services/locale/src/locale-store.js'

describe('locale-store', () => {
  afterEach(() => {
    localeStore.set('fr')
  })

  describe('set', () => {
    it('set updates the locale and persists it to localStorage', () => {
      localeStore.set('en')

      expect(localStorage.getItem('locale')).toBe('en')
    })
  })
})
