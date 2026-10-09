import { describe, it, expect, afterEach } from 'vitest'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'

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
})
