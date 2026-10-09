import { describe, it, expect, afterEach } from 'vitest'
import { localeStore, useLocaleStore } from '@/services/locale/src/locale-store.js'

describe('locale-store', () => {
  afterEach(() => {
    localeStore.set('fr')
  })

  describe('useLocaleStore', () => {
    it('exposes a readonly reactive ref through useLocaleStore', () => {
      const { currentRef } = useLocaleStore()

      localeStore.set('en')

      expect(currentRef.value).toBe('en')
    })
  })
})
