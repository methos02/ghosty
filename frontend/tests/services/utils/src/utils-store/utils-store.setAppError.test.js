import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetAppError()
  })

  describe('setAppError', () => {
    it('get / set the global app error', () => {
      const error = { code: 500, message: 'boom' }

      utilsStore.setAppError(error)

      expect(utilsStore.getAppError()).toEqual(error)
    })
  })
})
