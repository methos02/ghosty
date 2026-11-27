import { describe, it, expect } from 'vitest'
import { profileSlugHelper } from '@/core/helpers/profile-slug-helper.js'

describe('profile-slug-helper', () => {
  describe('canonicalLocation', () => {
    it('keeps the address when its profile slug is the current one', () => {
      expect(
        profileSlugHelper.canonicalLocation(
          { params: { profileSlug: 'd4sfq7-plume' }, query: {} },
          { profileSlug: 'd4sfq7-plume' },
        ),
      ).toBeUndefined()
    })

    it('replaces an outdated name and flags the renaming', () => {
      expect(
        profileSlugHelper.canonicalLocation(
          { name: 'profile-covers', params: { profileSlug: 'd4sfq7-ancien' }, query: {} },
          { profileSlug: 'd4sfq7-plume' },
        ),
      ).toEqual({
        name: 'profile-covers',
        params: { profileSlug: 'd4sfq7-plume' },
        query: { renamed: '1' },
      })
    })

    it('completes an address holding the slug alone without flagging a renaming', () => {
      expect(
        profileSlugHelper.canonicalLocation(
          { name: 'profile', params: { profileSlug: 'd4sfq7' }, query: {} },
          { profileSlug: 'd4sfq7-plume' },
        ),
      ).toEqual({
        name: 'profile',
        params: { profileSlug: 'd4sfq7-plume' },
        query: {},
      })
    })

    it('flags the renaming when the name now gives an empty name part', () => {
      expect(
        profileSlugHelper.canonicalLocation(
          { name: 'profile', params: { profileSlug: 'd4sfq7-ancien' }, query: {} },
          { profileSlug: 'd4sfq7' },
        ),
      ).toEqual({
        name: 'profile',
        params: { profileSlug: 'd4sfq7' },
        query: { renamed: '1' },
      })
    })
  })
})
