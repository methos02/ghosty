import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetLoadingSentence()
  })

  describe('getLoadingSentence', () => {
    it('defaults to the app-component loading key', () => {
      expect(utilsStore.getLoadingSentence()).toBe('app-component.loading')
    })
  })
})
