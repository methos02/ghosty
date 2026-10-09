import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/shortcuts/services-shortcut.js'
import { APP_STATUS } from '@/constants/utils-constants.js'

describe('utils-shortcut', () => {
  afterEach(() => {
    utilsStore.resetAppStatus()
  })

  describe('utilsStore', () => {
    it('delegates store methods and refs to the utils store', () => {
      utilsStore.setAppStatus(APP_STATUS.LOADED)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
      expect(utilsStore.appStatus.value).toBe(APP_STATUS.LOADED)
    })
  })
})
