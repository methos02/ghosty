import { describe, it, expect } from 'vitest'
import { profileSlugHelper } from '@/core/helpers/profile-slug-helper.js'

describe('profile-slug-helper', () => {
  describe('toSlug', () => {
    it('keeps the part of the profile slug before the first dash', () => {
      expect(profileSlugHelper.toSlug('d4sfq7-plume-de-nuit')).toBe('d4sfq7')
    })

    it('keeps a profile slug made of the slug alone', () => {
      expect(profileSlugHelper.toSlug('d4sfq7')).toBe('d4sfq7')
    })
  })
})
