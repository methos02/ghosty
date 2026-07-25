import { describe, it, expect, afterEach } from 'vitest'
import { utilsStore } from '@/services/utils/src/utils-store.js'
import { APP_STATUS } from '@/constants/utils-constants.js'

describe('utils-store', () => {
  afterEach(() => {
    utilsStore.resetAppStatus()
    utilsStore.resetLoadingSentence()
    utilsStore.resetAppError()
  })

  describe('app status', () => {
    it('get / set the app status', () => {
      utilsStore.setAppStatus(APP_STATUS.LOADED)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
    })

    it('reset restores the INIT status', () => {
      utilsStore.setAppStatus(APP_STATUS.LOADED)

      utilsStore.resetAppStatus()

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.INIT)
    })
  })

  describe('loading sentence', () => {
    it('defaults to the app-component loading key', () => {
      expect(utilsStore.getLoadingSentence()).toBe('app-component.loading')
    })

    it('set / get a custom loading sentence', () => {
      utilsStore.setLoadingSentence('novels.loading')

      expect(utilsStore.getLoadingSentence()).toBe('novels.loading')
    })

    it('reset restores the default loading sentence', () => {
      utilsStore.setLoadingSentence('novels.loading')

      utilsStore.resetLoadingSentence()

      expect(utilsStore.getLoadingSentence()).toBe('app-component.loading')
    })
  })

  describe('app error', () => {
    it('get / set the global app error', () => {
      const error = { code: 500, message: 'boom' }

      utilsStore.setAppError(error)

      expect(utilsStore.getAppError()).toEqual(error)
    })

    it('reset clears the global app error', () => {
      utilsStore.setAppError({ code: 500, message: 'boom' })

      utilsStore.resetAppError()

      expect(utilsStore.getAppError()).toBeUndefined()
    })
  })
})
