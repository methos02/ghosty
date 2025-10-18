import { describe, it, expect } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

describe('HydrateFunctions.extractUniqueIds', () => {
  it('should extract unique IDs from items', () => {
    const items = [
      { patient: { id: 1 } },
      { patient: { id: 2 } },
      { patient: { id: 1 } }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2])
  })

  it('should throw error if item key is null', () => {
    const items = [
      { patient: null },
      { patient: { id: 2 } }
    ]

    expect(() => {
      HydrateFunctions.extractUniqueIds(items, 'patient')
    }).toThrow('[utils.hydrate] Item "patient" is required and cannot be empty')
  })

  it('should throw error if item key is undefined', () => {
    const items = [
      {},
      { patient: { id: 2 } }
    ]

    expect(() => {
      HydrateFunctions.extractUniqueIds(items, 'patient')
    }).toThrow('[utils.hydrate] Item "patient" is required and cannot be empty')
  })

  it('should skip items with null id', () => {
    const items = [
      { patient: { id: null } },
      { patient: { id: 1 } },
      { patient: { id: 2 } }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2])
  })

  it('should skip items with undefined id', () => {
    const items = [
      { patient: { id: undefined } },
      { patient: { id: 1 } },
      { patient: { id: 2 } }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2])
  })

  it('should skip items with empty string id', () => {
    const items = [
      { patient: { id: '' } },
      { patient: { id: 1 } },
      { patient: { id: 2 } }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2])
  })

  it('should skip items without id property', () => {
    const items = [
      { patient: {} },
      { patient: { id: 1 } },
      { patient: { id: 2 } }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2])
  })

  it('should handle mix of valid and empty ids', () => {
    const items = [
      { patient: { id: 1 } },
      { patient: { id: null } },
      { patient: { id: 2 } },
      { patient: { id: '' } },
      { patient: { id: 3 } },
      { patient: { id: undefined } },
      { patient: {} }
    ]

    const ids = HydrateFunctions.extractUniqueIds(items, 'patient')

    expect(ids).toEqual([1, 2, 3])
  })
})
