import { describe, it, expect, afterEach } from 'vitest'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'

describe('utils-hydrate', () => {
  afterEach(() => {
    HydrateFunctions.clearControllers()
  })

  describe('loadController', () => {
    it('throws when the controller is not registered', async () => {
      await expect(HydrateFunctions.loadController('ghost', 'ghost')).rejects.toThrow(
        /not registered/,
      )
    })

    it('throws when the requested method is missing', async () => {
      HydrateFunctions.registerController('author', { somethingElse: () => {} })

      await expect(HydrateFunctions.loadController('author', 'author', 'byIds')).rejects.toThrow(
        /does not have a "byIds" method/,
      )
    })
  })
})
