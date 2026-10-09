import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetLoadingSentence()
  })

  describe('setLoadingSentence', () => {
    it('set / get a custom loading sentence', () => {
      utilsStore.setLoadingSentence('novels.loading')

      expect(utilsStore.getLoadingSentence()).toBe('novels.loading')
    })
  })
})
