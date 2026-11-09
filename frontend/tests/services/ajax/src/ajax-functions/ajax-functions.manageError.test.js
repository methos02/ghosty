import { describe, it, expect, vi, afterEach } from 'vitest'
import { ajaxFunctions } from '@/services/ajax/src/ajax-functions.js'
import { Request } from '@/services/ajax/src/models/request.js'
import { flash, form } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

const httpError = (status, data = {}) => ({
  response: { status, statusText: `HTTP ${status}`, data },
})

describe('ajax-functions', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('manageError', () => {
    it('maps a cancelled request to status 499 with empty data', async () => {
      const result = await ajaxFunctions.manageError({ code: 'ERR_CANCELED' })

      expect(result).toEqual({ data: {}, status: 499 })
    })

    it('maps a network error (no response) to a 500 server error', async () => {
      const result = await ajaxFunctions.manageError({ message: 'Network error' })

      expect(result).toEqual({ data: { error: 'error_server' }, status: 500 })
    })

    it('flashes and returns the response for a server error', async () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})
      const error = httpError(STATUS.ERROR_SERVER)

      const result = await ajaxFunctions.manageError(error)

      expect(errorT).toHaveBeenCalledWith('error_server')
      expect(result).toBe(error.response)
    })

    it('does not flash on a 422 validation error but still returns the response', async () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})
      const error = httpError(STATUS.UNPROCESSABLE_ENTITY, { errors: {} })

      const result = await ajaxFunctions.manageError(error)

      expect(errorT).not.toHaveBeenCalled()
      expect(result).toBe(error.response)
    })

    it('puts the errors of a 422 on the form named by the request', async () => {
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})
      const requestId = Request.init({ api: 'ghosty' }, { form: 'novel' })
      const errors = { title: ['Le titre du roman est obligatoire'] }
      const error = { ...httpError(STATUS.UNPROCESSABLE_ENTITY, { errors }), config: { requestId } }

      await ajaxFunctions.manageError(error)

      expect(addValidationErrors).toHaveBeenCalledWith(errors, 'novel')
      Request.remove(requestId)
    })

    it('leaves the forms alone when the request names no form', async () => {
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})
      const requestId = Request.init({ api: 'ghosty' }, {})
      const error = { ...httpError(STATUS.UNPROCESSABLE_ENTITY, { errors: {} }), config: { requestId } }

      await ajaxFunctions.manageError(error)

      expect(addValidationErrors).not.toHaveBeenCalled()
      Request.remove(requestId)
    })

    it('leaves the form alone on an error other than a 422', async () => {
      vi.spyOn(flash, 'errorT').mockImplementation(() => {})
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})
      const requestId = Request.init({ api: 'ghosty' }, { form: 'novel', log: false })
      const error = { ...httpError(STATUS.ERROR_SERVER), config: { requestId } }

      await ajaxFunctions.manageError(error)

      expect(addValidationErrors).not.toHaveBeenCalled()
      Request.remove(requestId)
    })
  })
})
