import { describe, it, expect, afterEach, vi } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

describe('HydrateFunctions.loadController', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throw error if controller not found in module', async () => {
    vi.doMock('/src/apis/test/controllers/test-controller.js', () => ({
      SomethingElse: {}
    }))

    await expect(
      HydrateFunctions.loadController('test', 'testKey')
    ).rejects.toThrow('[utils.hydrate] Controller not found in module for key "testKey"')
  })

  it('should throw error if controller does not have byIds method', async () => {
    const mockModule = {
      TestController: {
        list: vi.fn()
      }
    }

    vi.doMock('/src/apis/test/controllers/test-controller.js', () => mockModule)

    await expect(
      HydrateFunctions.loadController('test', 'testKey')
    ).rejects.toThrow('[utils.hydrate] Controller "TestController" does not have a "byIds" method')
  })

  it('should throw error if controller does not have custom method', async () => {
    const mockModule = {
      TestController: {
        byIds: vi.fn()
      }
    }

    vi.doMock('/src/apis/test/controllers/test-controller.js', () => mockModule)

    await expect(
      HydrateFunctions.loadController('test', 'testKey', 'customMethod')
    ).rejects.toThrow('[utils.hydrate] Controller "TestController" does not have a "customMethod" method')
  })

  it('should validate custom method exists on controller', async () => {
    const mockModule = {
      TestController: {
        byIds: vi.fn(),
        getByIdsWithDetails: vi.fn()
      }
    }

    vi.doMock('/src/apis/test/controllers/test-controller.js', () => mockModule)

    await expect(
      HydrateFunctions.loadController('test', 'testKey', 'getByIdsWithDetails')
    ).resolves.toEqual(mockModule.TestController)
  })
})
