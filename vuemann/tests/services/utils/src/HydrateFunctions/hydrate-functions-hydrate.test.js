import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { getHospitalizations, getPatients, getServices } from '&/utils/seeders/hospitalization-seeder.js'

describe('HydrateFunctions.hydrate', () => {
  let mockPatientController
  let mockServiceController

  beforeEach(() => {
    mockPatientController = {
      byIds: vi.fn()
    }

    mockServiceController = {
      byIds: vi.fn()
    }

    vi.spyOn(HydrateFunctions, 'loadController').mockImplementation(async (controllerName) => {
      if (controllerName === 'patient') return mockPatientController
      if (controllerName === 'service') return mockServiceController
      throw new Error(`Unknown controller: ${controllerName}`)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throw error if data is empty', async () => {
    await expect(HydrateFunctions.hydrate([], ['patient'])).rejects.toThrow('[utils.hydrate] Data is required and cannot be empty')
  })

  it('should throw error if data is null', async () => {
    await expect(HydrateFunctions.hydrate(null, ['patient'])).rejects.toThrow('[utils.hydrate] Data is required and cannot be empty')
  })

  it('should hydrate a single key', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'])

    expect(mockPatientController.byIds).toHaveBeenCalledWith([1, 2])
    expect(result).toHaveLength(2)
    expect(result[0].patient).toEqual(patients[0])
    expect(result[1].patient).toEqual(patients[1])
  })

  it('should hydrate multiple keys', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)
    const services = getServices(2)

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    mockServiceController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: services
    })

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient', 'service'])

    expect(mockPatientController.byIds).toHaveBeenCalledWith([1, 2])
    expect(mockServiceController.byIds).toHaveBeenCalledWith([1, 2])
    expect(result).toHaveLength(2)
    expect(result[0].patient).toEqual(patients[0])
    expect(result[0].service).toEqual(services[0])
    expect(result[1].patient).toEqual(patients[1])
    expect(result[1].service).toEqual(services[1])
  })

  it('should handle filter function that excludes items', async () => {
    const hospitalizations = getHospitalizations(3, { status: 'active' })
    hospitalizations[1].status = 'inactive'

    const patients = [
      { id: 1, firstname: 'Patient1', lastname: 'LastName1', birthdate: '1990-01-01', email: 'patient1@hospital.be' },
      { id: 3, firstname: 'Patient3', lastname: 'LastName3', birthdate: '1990-01-03', email: 'patient3@hospital.be' }
    ]

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const config = {
      patient: {
        filter: (h) => h.status === 'active'
      }
    }

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(mockPatientController.byIds).toHaveBeenCalledWith([1, 3])
    expect(result[0].patient).toEqual(patients[0])
    expect(result[1].patient).toEqual({ id: 2 })
    expect(result[2].patient).toEqual(patients[1])
  })

  it('should keep original items when filter returns truthy value', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    const config = {
      patient: {
        filter: (h) => h.id > 0
      }
    }

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(mockPatientController.byIds).toHaveBeenCalledWith([1, 2])
    expect(result[0].patient).toEqual(patients[0])
    expect(result[1].patient).toEqual(patients[1])
  })

  it('should use custom controller name', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    const mockCustomController = {
      byIds: vi.fn().mockResolvedValue({
        status: STATUS.SUCCESS,
        data: patients
      })
    }

    vi.spyOn(HydrateFunctions, 'loadController').mockResolvedValue(mockCustomController)

    const config = {
      patient: {
        controller: 'customPatient'
      }
    }

    await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(HydrateFunctions.loadController).toHaveBeenCalledWith('customPatient', 'patient', 'byIds')
    expect(mockCustomController.byIds).toHaveBeenCalledWith([1, 2])
  })

  it('should handle controller error gracefully', async () => {
    const hospitalizations = getHospitalizations(2)

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.ERROR,
      error: 'API Error'
    })

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'])

    expect(result[0].patient).toEqual({ id: 1 })
    expect(result[1].patient).toEqual({ id: 2 })
  })

  it('should deduplicate IDs before calling controller', async () => {
    const hospitalizations = [
      { id: 1, patient: { id: 1 } },
      { id: 2, patient: { id: 1 } },
      { id: 3, patient: { id: 2 } }
    ]

    const patients = getPatients(2)

    mockPatientController.byIds.mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    await HydrateFunctions.hydrate(hospitalizations, ['patient'])

    expect(mockPatientController.byIds).toHaveBeenCalledWith([1, 2])
  })

  it('should not call controller if filter excludes all items', async () => {
    const hospitalizations = getHospitalizations(2)

    const config = {
      patient: {
        filter: () => false
      }
    }

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(mockPatientController.byIds).not.toHaveBeenCalled()
    expect(result[0].patient).toEqual({ id: 1 })
    expect(result[1].patient).toEqual({ id: 2 })
  })

  it('should use custom method when specified in config', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    mockPatientController.getByIdsWithDetails = vi.fn().mockResolvedValue({
      status: STATUS.SUCCESS,
      data: patients
    })

    vi.spyOn(HydrateFunctions, 'loadController').mockResolvedValue(mockPatientController)

    const config = {
      patient: {
        method: 'getByIdsWithDetails'
      }
    }

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(HydrateFunctions.loadController).toHaveBeenCalledWith('patient', 'patient', 'getByIdsWithDetails')
    expect(mockPatientController.getByIdsWithDetails).toHaveBeenCalledWith([1, 2])
    expect(result[0].patient).toEqual(patients[0])
    expect(result[1].patient).toEqual(patients[1])
  })

  it('should combine custom method and custom controller', async () => {
    const hospitalizations = getHospitalizations(2)
    const patients = getPatients(2)

    const mockCustomController = {
      customMethod: vi.fn().mockResolvedValue({
        status: STATUS.SUCCESS,
        data: patients
      })
    }

    vi.spyOn(HydrateFunctions, 'loadController').mockResolvedValue(mockCustomController)

    const config = {
      patient: {
        controller: 'customPatient',
        method: 'customMethod'
      }
    }

    const result = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)

    expect(HydrateFunctions.loadController).toHaveBeenCalledWith('customPatient', 'patient', 'customMethod')
    expect(mockCustomController.customMethod).toHaveBeenCalledWith([1, 2])
    expect(result[0].patient).toEqual(patients[0])
    expect(result[1].patient).toEqual(patients[1])
  })
})
