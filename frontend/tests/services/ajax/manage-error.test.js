import { describe, it, expect, vi, afterEach } from 'vitest'
import { ajaxFunctions } from '@/services/ajax/src/ajax-functions.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

const httpError = (status, data = {}) => ({
  response: { status, statusText: `HTTP ${status}`, data },
})

describe('ajax-functions.manageError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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
})
