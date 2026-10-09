import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetAppError()
  })

  describe('resetAppError', () => {
    it('reset clears the global app error', () => {
      utilsStore.setAppError({ code: 500, message: 'boom' })

      utilsStore.resetAppError()

      expect(utilsStore.getAppError()).toBeUndefined()
    })
  })
})
