import { describe, it, expect } from 'vitest'
import { internals } from '@/services/ajax/src/models/http-client.js'

describe('http-client', () => {
  describe('applyBody', () => {
    it('sends a FormData body as is, leaving the content type to the browser', () => {
      const formData = new FormData()
      formData.append('image', new Blob(['image']), 'cover.png')
      const fetchOptions = { headers: {} }

      internals.applyBody(fetchOptions, formData)

      expect(fetchOptions).toEqual({
        headers: {},
        body: formData,
      })
    })

    it('serializes an object body as json', () => {
      const fetchOptions = { headers: {} }

      internals.applyBody(fetchOptions, { reason: 'spam' })

      expect(fetchOptions).toEqual({
        headers: { 'Content-Type': 'application/json' },
        body: '{"reason":"spam"}',
      })
    })

    it('sends no body for an empty object', () => {
      const fetchOptions = { headers: {} }

      internals.applyBody(fetchOptions, {})

      expect(fetchOptions).toEqual({ headers: {} })
    })
  })
})
