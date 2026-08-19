import { describe, it, expect, afterEach } from 'vitest'
import { utils, utilsStore } from '@/services/shortcuts/services-shortcut.js'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'
import { APP_STATUS } from '@/constants/utils-constants.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('utils shortcut', () => {
  afterEach(() => {
    utilsStore.resetAppStatus()
    HydrateFunctions.clearControllers()
  })

  it('delegates store methods and refs to the utils store', () => {
    utilsStore.setAppStatus(APP_STATUS.LOADED)

    expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
    expect(utilsStore.appStatus.value).toBe(APP_STATUS.LOADED)
  })

  it('registers a controller and hydrates data through the shortcut', async () => {
    utils.registerController('author', {
      byIds: async ids => ({
        status: STATUS.SUCCESS,
        data: [{ id: 7, username: 'Alice' }].filter(entity => ids.includes(entity.id)),
      }),
    })

    const result = await utils.hydrate([{ id: 1, author: { id: 7 } }], ['author'])

    expect(result[0].author).toEqual({ id: 7, username: 'Alice' })
  })
})
