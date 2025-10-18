import { describe, it, expect } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

describe('HydrateFunctions.buildEntitiesMap', () => {
  it('should build a map of entities by key', () => {
    const results = [
      { key: 'patient', entities: [{ id: 1, name: 'Patient 1' }, { id: 2, name: 'Patient 2' }] },
      { key: 'service', entities: [{ id: 1, name: 'Service 1' }] }
    ]

    const map = HydrateFunctions.buildEntitiesMap(results)

    expect(map.patient).toBeInstanceOf(Map)
    expect(map.patient.get(1)).toEqual({ id: 1, name: 'Patient 1' })
    expect(map.patient.get(2)).toEqual({ id: 2, name: 'Patient 2' })
    expect(map.service).toBeInstanceOf(Map)
    expect(map.service.get(1)).toEqual({ id: 1, name: 'Service 1' })
  })

  it('should handle empty entities', () => {
    const results = [
      { key: 'patient', entities: [] }
    ]

    const map = HydrateFunctions.buildEntitiesMap(results)

    expect(map.patient).toBeInstanceOf(Map)
    expect(map.patient.size).toBe(0)
  })
})
