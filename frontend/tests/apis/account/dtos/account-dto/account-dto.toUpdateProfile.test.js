import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toUpdateProfile', () => {
    it('sends the username as a multipart body', () => {
      const formData = accountSeeder.getProfileForm()

      expect(Object.fromEntries(AccountDto.toUpdateProfile(formData))).toEqual({
        username: formData.username,
      })
    })

    it('joins the new avatar image to the profile', () => {
      const image = accountSeeder.getAvatarImageFile()

      const body = AccountDto.toUpdateProfile(accountSeeder.getProfileForm({ image }))

      expect(body.get('image').name).toBe(image.name)
    })

    it('leaves the avatar out when no new image was chosen', () => {
      expect(AccountDto.toUpdateProfile(accountSeeder.getProfileForm()).has('image')).toBe(false)
    })
  })
})
