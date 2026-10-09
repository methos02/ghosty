import { describe, it, expect, afterEach } from 'vitest'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('utils-hydrate', () => {
  afterEach(() => {
    HydrateFunctions.clearControllers()
  })

  describe('hydrate', () => {
    it('returns an empty array for empty data', async () => {
      expect(await HydrateFunctions.hydrate([], ['author'])).toEqual([])
    })

    it('replaces nested references with the fetched entities', async () => {
      const entities = [
        { id: 7, username: 'Alice' },
        { id: 8, username: 'Bob' },
      ]
      HydrateFunctions.registerController('author', {
        byIds: async ids => ({
          status: STATUS.SUCCESS,
          data: entities.filter(entity => ids.includes(entity.id)),
        }),
      })

      const data = [
        { id: 1, author: { id: 7 } },
        { id: 2, author: { id: 8 } },
      ]

      const result = await HydrateFunctions.hydrate(data, ['author'])

      expect(result[0].author).toEqual({ id: 7, username: 'Alice' })
      expect(result[1].author).toEqual({ id: 8, username: 'Bob' })
    })

    it('leaves items untouched when the controller call fails', async () => {
      HydrateFunctions.registerController('author', {
        byIds: async () => ({ status: STATUS.ERROR_SERVER }),
      })

      const data = [{ id: 1, author: { id: 7 } }]

      const result = await HydrateFunctions.hydrate(data, ['author'])

      expect(result[0].author).toEqual({ id: 7 })
    })
  })
})
