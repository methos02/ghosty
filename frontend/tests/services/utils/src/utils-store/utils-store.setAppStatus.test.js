import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'
import { APP_STATUS } from '@/constants/utils-constants.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetAppStatus()
  })

  describe('setAppStatus', () => {
    it('get / set the app status', () => {
      utilsStore.setAppStatus(APP_STATUS.LOADED)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
    })
  })
})
