import { describe, it, expect, afterEach } from 'vitest'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'

describe('utils-hydrate', () => {
  afterEach(() => {
    HydrateFunctions.clearControllers()
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
})
