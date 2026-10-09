import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetLoadingSentence()
  })

  describe('resetLoadingSentence', () => {
    it('reset restores the default loading sentence', () => {
      utilsStore.setLoadingSentence('novels.loading')

      utilsStore.resetLoadingSentence()

      expect(utilsStore.getLoadingSentence()).toBe('app-component.loading')
    })
  })
})
