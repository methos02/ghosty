import { describe, it, expect } from 'vitest'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('controller-response-helper', () => {
  describe('buildResponse', () => {
    it('answers a bare success when there is nothing to map', async () => {
      const response = { status: STATUS.NO_CONTENT, data: {} }

      expect(await controllerResponseHelper.buildResponse(response)).toEqual({ status: STATUS.SUCCESS })
    })

    it('adds the mapped data of the api to the success', async () => {
      const response = { status: STATUS.CREATED, data: { title: 'La nuit du virage' } }

      const result = await controllerResponseHelper.buildResponse(response, data => ({ novelTitle: data.title }))

      expect(result).toEqual({ novelTitle: 'La nuit du virage', status: STATUS.SUCCESS })
    })

    it('keeps the success status even if the mapping returns a status of its own', async () => {
      const response = { status: STATUS.SUCCESS, data: {} }

      const result = await controllerResponseHelper.buildResponse(response, () => ({ status: STATUS.CREATED }))

      expect(result.status).toBe(STATUS.SUCCESS)
    })

    it('passes a failure through untouched without mapping it', async () => {
      const failure = { status: STATUS.UNPROCESSABLE_ENTITY, data: { errors: {} } }
      let isMapped = false

      const result = await controllerResponseHelper.buildResponse(failure, () => {
        isMapped = true
        return {}
      })

      expect(result).toBe(failure)
      expect(isMapped).toBe(false)
    })
  })
})
