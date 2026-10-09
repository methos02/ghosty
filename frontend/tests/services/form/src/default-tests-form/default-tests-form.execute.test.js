import { describe, it, expect, vi, afterEach } from 'vitest'
import { defaultTests } from '@/services/form/src/default-tests-form.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('default-tests-form', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('execute', () => {
    describe('required', () => {
      it('fails on empty values', () => {
        expect(defaultTests.execute('required', '', {})).toBe('field_required')
        expect(defaultTests.execute('required', null, {})).toBe('field_required')
        expect(defaultTests.execute('required', [], {})).toBe('field_required')
        expect(defaultTests.execute('required', {}, {})).toBe('field_required')
      })

      it('passes on a filled value', () => {
        expect(defaultTests.execute('required', 'hello', {})).toBe('')
      })
    })

    describe('in', () => {
      it('passes when the value is in the allowed list', () => {
        expect(defaultTests.execute('in:red,green,blue', 'green', {})).toBe('')
      })

      it('fails with the allowed list interpolated when the value is not allowed', () => {
        expect(defaultTests.execute('in:red,green', 'yellow', {})).toBe('field_in:in=red,green')
      })
    })

    describe('integer', () => {
      it('passes on digits only', () => {
        expect(defaultTests.execute('integer', '42', {})).toBe('')
      })

      it('fails on non-digits', () => {
        expect(defaultTests.execute('integer', '4a', {})).toBe('field_invalid')
        expect(defaultTests.execute('integer', '-3', {})).toBe('field_invalid')
      })
    })

    describe('positive', () => {
      it('passes on a positive integer', () => {
        expect(defaultTests.execute('positive', '0', {})).toBe('')
        expect(defaultTests.execute('positive', '7', {})).toBe('')
      })

      it('fails on a non positive integer', () => {
        expect(defaultTests.execute('positive', 'x', {})).toBe('field_invalid')
      })
    })

    describe('min / max', () => {
      it('min fails below the threshold', () => {
        expect(defaultTests.execute('min:10', '5', {})).toBe('field_min:min=10')
      })

      it('min passes at or above the threshold', () => {
        expect(defaultTests.execute('min:10', '10', {})).toBe('')
      })

      it('max fails above the threshold', () => {
        expect(defaultTests.execute('max:10', '11', {})).toBe('field_max:max=10')
      })

      it('max passes at or below the threshold', () => {
        expect(defaultTests.execute('max:10', '10', {})).toBe('')
      })
    })

    describe('size / sizeMin / sizeMax', () => {
      it('size requires an exact length', () => {
        expect(defaultTests.execute('size:3', 'abc', {})).toBe('')
        expect(defaultTests.execute('size:3', 'ab', {})).toBe('field_size_equal:size=3')
      })

      it('sizeMin requires a minimum length', () => {
        expect(defaultTests.execute('sizeMin:3', 'abc', {})).toBe('')
        expect(defaultTests.execute('sizeMin:3', 'ab', {})).toBe('field_size_min:size=3')
      })

      it('sizeMax requires a maximum length', () => {
        expect(defaultTests.execute('sizeMax:3', 'abc', {})).toBe('')
        expect(defaultTests.execute('sizeMax:3', 'abcd', {})).toBe('field_size_max:size=3')
      })
    })

    describe('email', () => {
      it('passes on a valid email', () => {
        expect(defaultTests.execute('email', 'ghost@ghosty.test', {})).toBe('')
      })

      it('fails on an invalid email', () => {
        expect(defaultTests.execute('email', 'not-an-email', {})).toBe('field_email')
        expect(defaultTests.execute('email', 'a@b', {})).toBe('field_email')
      })
    })

    describe('date rules', () => {
      it('dispatches the date rule to dateTests with the given format', () => {
        expect(defaultTests.execute('date:dd/mm/yyyy', '25/12/2024', {})).toBe('')
        expect(defaultTests.execute('date:dd/mm/yyyy', '32/12/2024', {})).toBe('date_invalid')
      })
    })

    describe('unknown test', () => {
      it('reports the unknown test through flash.error', () => {
        const error = vi.spyOn(flash, 'error').mockImplementation(() => {})

        defaultTests.execute('doesNotExist', 'x', {})

        expect(error).toHaveBeenCalledWith('Le test "doesNotExist" est inconnu.')
      })
    })
  })
})
