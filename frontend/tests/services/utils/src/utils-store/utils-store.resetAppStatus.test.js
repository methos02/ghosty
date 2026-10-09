import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'
import { APP_STATUS } from '@/constants/utils-constants.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetAppStatus()
  })

  describe('resetAppStatus', () => {
    it('reset restores the INIT status', () => {
      utilsStore.setAppStatus(APP_STATUS.LOADED)

      utilsStore.resetAppStatus()

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.INIT)
    })
  })
})
