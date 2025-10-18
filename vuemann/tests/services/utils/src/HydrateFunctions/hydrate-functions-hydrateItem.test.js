import { describe, it, expect } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

describe('HydrateFunctions.hydrateItem', () => {
  it('should replace references with full entities', () => {
    const item = {
      id: 1,
      patient: { id: 1 },
      service: { id: 2 }
    }

    const entitiesByKey = {
      patient: new Map([[1, { id: 1, name: 'Patient 1' }]]),
      service: new Map([[2, { id: 2, name: 'Service 2' }]])
    }

    const result = HydrateFunctions.hydrateItem(item, ['patient', 'service'], entitiesByKey)

    expect(result.patient).toEqual({ id: 1, name: 'Patient 1' })
    expect(result.service).toEqual({ id: 2, name: 'Service 2' })
    expect(result.id).toBe(1)
  })

  it('should keep original reference if entity not found', () => {
    const item = {
      id: 1,
      patient: { id: 99 }
    }

    const entitiesByKey = {
      patient: new Map([[1, { id: 1, name: 'Patient 1' }]])
    }

    const result = HydrateFunctions.hydrateItem(item, ['patient'], entitiesByKey)

    expect(result.patient).toEqual({ id: 99 })
  })

  it('should not modify original item', () => {
    const item = {
      id: 1,
      patient: { id: 1 }
    }

    const entitiesByKey = {
      patient: new Map([[1, { id: 1, name: 'Patient 1' }]])
    }

    const result = HydrateFunctions.hydrateItem(item, ['patient'], entitiesByKey)

    expect(item.patient).toEqual({ id: 1 })
    expect(result.patient).toEqual({ id: 1, name: 'Patient 1' })
  })
})
