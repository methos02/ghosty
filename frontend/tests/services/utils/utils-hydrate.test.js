import { describe, it, expect, afterEach } from 'vitest'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'
import { STATUS } from '@/constants/ajax-constants.js'

const makeController = entities => ({
  byIds: async ids => ({
    status: STATUS.SUCCESS,
    data: entities.filter(entity => ids.includes(entity.id)),
  }),
})

describe('utils-hydrate', () => {
  afterEach(() => {
    HydrateFunctions.clearControllers()
  })

  describe('extractUniqueIds', () => {
    it('collects unique ids from the nested key', () => {
      const items = [{ author: { id: 7 } }, { author: { id: 8 } }, { author: { id: 7 } }]

      expect(HydrateFunctions.extractUniqueIds(items, 'author')).toEqual([7, 8])
    })

    it('throws when the key is missing on an item', () => {
      expect(() => HydrateFunctions.extractUniqueIds([{ author: null }], 'author')).toThrow()
    })

    it('skips items whose nested id is empty', () => {
      const items = [{ author: { id: '' } }, { author: { id: 8 } }]

      expect(HydrateFunctions.extractUniqueIds(items, 'author')).toEqual([8])
    })
  })

  describe('buildEntitiesMap', () => {
    it('indexes entities by their entity key', () => {
      const map = HydrateFunctions.buildEntitiesMap([
        { key: 'author', entities: [{ id: 7 }, { id: 8 }] },
      ])

      expect(map.author.get(7)).toEqual({ id: 7 })
      expect(map.author.get(8)).toEqual({ id: 8 })
    })
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

  describe('hydrate', () => {
    it('returns an empty array for empty data', async () => {
      expect(await HydrateFunctions.hydrate([], ['author'])).toEqual([])
    })

    it('replaces nested references with the fetched entities', async () => {
      HydrateFunctions.registerController(
        'author',
        makeController([
          { id: 7, username: 'Alice' },
          { id: 8, username: 'Bob' },
        ]),
      )

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
