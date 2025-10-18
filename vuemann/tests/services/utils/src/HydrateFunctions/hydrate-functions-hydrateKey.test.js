import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { getHospitalizations, getPatients } from '&/utils/seeders/hospitalization-seeder.js'

describe('HydrateFunctions.hydrateKey', () => {
  let mockController

  beforeEach(() => {
    mockController = {
      byIds: vi.fn()
    }

    vi.spyOn(HydrateFunctions, 'loadController').mockResolvedValue(mockController)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return empty entities if filter excludes all items', async () => {
    const hospitalizations = getHospitalizations(2)
    const config = {
      filter: () => false
    }

    const result = await HydrateFunctions.hydrateKey(hospitalizations, 'patient', config)

    expect(result).toEqual({ key: 'patient', entities: [] })
    expect(mockController.byIds).not.toHaveBeenCalled()
  })

  it('should use default filter if not provided', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const result = await HydrateFunctions.hydrateKey(hospitalizations, 'patient', {})

    expect(result.entities).toEqual(patients)
  })

  it('should return empty entities on controller error', async () => {
    const hospitalizations = getHospitalizations(2)

    mockController.byIds.mockResolvedValue({
      status: STATUS.ERROR,
      error: 'API Error'
    })

    const result = await HydrateFunctions.hydrateKey(hospitalizations, 'patient', {})

    expect(result).toEqual({ key: 'patient', entities: [] })
  })

  it('should use custom method when specified in config', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockController.getByIdsWithDetails = vi.fn().mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const config = {
      method: 'getByIdsWithDetails'
    }

    const result = await HydrateFunctions.hydrateKey(hospitalizations, 'patient', config)

    expect(HydrateFunctions.loadController).toHaveBeenCalledWith('patient', 'patient', 'getByIdsWithDetails')
    expect(mockController.getByIdsWithDetails).toHaveBeenCalledWith([1, 2])
    expect(result.entities).toEqual(patients)
  })

  it('should use default byIds method when method not specified', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const result = await HydrateFunctions.hydrateKey(hospitalizations, 'patient', {})

    expect(HydrateFunctions.loadController).toHaveBeenCalledWith('patient', 'patient', 'byIds')
    expect(mockController.byIds).toHaveBeenCalledWith([1, 2])
    expect(result.entities).toEqual(patients)
  })
})
