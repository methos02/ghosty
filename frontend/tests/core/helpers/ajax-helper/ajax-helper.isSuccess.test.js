import { describe, it, expect } from 'vitest'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('ajax-helper', () => {
  describe('isSuccess', () => {
    it('accepts the codes an api answers when it writes', () => {
      expect(ajaxHelper.isSuccess(STATUS.SUCCESS)).toBe(true)
      expect(ajaxHelper.isSuccess(STATUS.CREATED)).toBe(true)
      expect(ajaxHelper.isSuccess(STATUS.NO_CONTENT)).toBe(true)
    })

    it('rejects the failures', () => {
      expect(ajaxHelper.isSuccess(STATUS.UNPROCESSABLE_ENTITY)).toBe(false)
      expect(ajaxHelper.isSuccess(STATUS.FORBIDDEN)).toBe(false)
      expect(ajaxHelper.isSuccess(STATUS.ERROR_SERVER)).toBe(false)
    })
  })
})
