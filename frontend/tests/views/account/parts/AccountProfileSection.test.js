import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountProfileSection from '@/views/account/parts/AccountProfileSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountProfileSection.vue', () => {
  let wrapper

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    form.clearErrors()
    flash.clearFlashes()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('fills the form with the profile of the connected user', () => {
    const user = userSeeder.getUser()

    wrapper = mount(AccountProfileSection)

    expect(wrapper.find('input[name="accountProfile.username"]').element.value).toBe(user.username)
  })

  it('checks the availability of the typed username once the typing paused', async () => {
    vi.useFakeTimers()
    const username = accountSeeder.getProfileForm().username
    vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue(
      controllerSuccess({ data: accountSeeder.getUsernameAvailabilityApi() }),
    )
    wrapper = mount(AccountProfileSection)

    await wrapper.find('input[name="accountProfile.username"]').setValue(username)
    expect(AccountRepository.checkUsernameAvailability).not.toHaveBeenCalled()
    expect(wrapper.find('.account-profile-section__availability').text()).toBe(
      t('account_profile_section.username_checking'),
    )
    await vi.advanceTimersByTimeAsync(ConfigLoader.get('account.usernameCheckDelay'))
    await flushPromises()

    expect(AccountRepository.checkUsernameAvailability).toHaveBeenCalledWith({
      params: AccountDto.toUsernameAvailabilityParams(username),
    })
    expect(wrapper.find('.account-profile-section__availability').text()).toBe(
      t('account_profile_section.username_available'),
    )
  })

  it('checks only the last username typed during the delay', async () => {
    vi.useFakeTimers()
    const username = accountSeeder.getProfileForm().username
    vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue(
      controllerSuccess({ data: accountSeeder.getUsernameAvailabilityApi() }),
    )
    wrapper = mount(AccountProfileSection)

    await wrapper.find('input[name="accountProfile.username"]').setValue(username.slice(0, 4))
    await wrapper.find('input[name="accountProfile.username"]').setValue(username)
    await vi.advanceTimersByTimeAsync(ConfigLoader.get('account.usernameCheckDelay'))
    await flushPromises()

    expect(AccountRepository.checkUsernameAvailability).toHaveBeenCalledTimes(1)
  })

  it('warns that the username is taken and blocks the saving', async () => {
    vi.useFakeTimers()
    vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue(
      controllerSuccess({ data: accountSeeder.getUsernameAvailabilityApi({ available: false }) }),
    )
    wrapper = mount(AccountProfileSection)

    await wrapper
      .find('input[name="accountProfile.username"]')
      .setValue(accountSeeder.getProfileForm().username)
    await vi.advanceTimersByTimeAsync(ConfigLoader.get('account.usernameCheckDelay'))
    await flushPromises()

    expect(wrapper.find('.account-profile-section__availability--taken').text()).toBe(
      t('account_profile_section.username_taken'),
    )
    expect(wrapper.find('.account-profile-section__save').attributes('disabled')).toBeDefined()
  })

  it('does not check the username the user already has', async () => {
    vi.useFakeTimers()
    vi.spyOn(AccountRepository, 'checkUsernameAvailability')
    wrapper = mount(AccountProfileSection)

    await wrapper.find('input[name="accountProfile.username"]').setValue('Autre')
    await wrapper
      .find('input[name="accountProfile.username"]')
      .setValue(userSeeder.getUser().username)
    await vi.advanceTimersByTimeAsync(ConfigLoader.get('account.usernameCheckDelay'))

    expect(AccountRepository.checkUsernameAvailability).not.toHaveBeenCalled()
    expect(wrapper.find('.account-profile-section__availability').exists()).toBe(false)
  })

  it('saves the profile and updates the connected user', async () => {
    const userApi = accountSeeder.getUpdatedUserApi()
    vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue(
      controllerSuccess({ data: accountSeeder.getUsernameAvailabilityApi() }),
    )
    vi.spyOn(AccountRepository, 'updateProfile').mockResolvedValue(
      controllerSuccess({ data: userApi }),
    )
    wrapper = mount(AccountProfileSection)

    await wrapper.find('input[name="accountProfile.username"]').setValue(userApi.username)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const { body, form: formName } = AccountRepository.updateProfile.mock.calls[0][0]
    expect(Object.fromEntries(body)).toEqual(
      Object.fromEntries(AccountDto.toUpdateProfile({ username: userApi.username })),
    )
    expect(formName).toBe('accountProfile')
    expect(useAuthStore().user.value).toEqual(AuthDto.fromUser(userApi))
    expect(flash.getFlashes().at(-1).content).toBe(t('account_profile_section.saved'))
  })

  it('sends the cropped avatar with the profile and closes the cropper', async () => {
    const userApi = userSeeder.getUserWithAvatarApi()
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:avatar-source')
    globalThis.URL.revokeObjectURL = vi.fn()
    vi.spyOn(AccountRepository, 'updateProfile').mockResolvedValue(
      controllerSuccess({ data: userApi }),
    )
    wrapper = mount(AccountProfileSection)
    const input = wrapper.find('.account-avatar-section__input')
    Object.defineProperty(input.element, 'files', {
      value: [accountSeeder.getAvatarImageFile({ width: 600, height: 400 })],
    })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.image-cropper').exists()).toBe(true))

    await wrapper.find('form').trigger('submit')
    await vi.waitFor(() => expect(AccountRepository.updateProfile).toHaveBeenCalled())
    await flushPromises()

    const image = AccountRepository.updateProfile.mock.calls[0][0].body.get('image')
    expect(JSON.parse(await image.text())).toEqual({ width: 400, height: 400 })
    expect(wrapper.find('.image-cropper').exists()).toBe(false)
    expect(wrapper.find('img.account-avatar-section__avatar').attributes('src')).toBe(
      userApi.avatar_url,
    )
    delete globalThis.URL.createObjectURL
    delete globalThis.URL.revokeObjectURL
  })

  it('does not save a username shorter than three characters', async () => {
    vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue(
      controllerSuccess({ data: accountSeeder.getUsernameAvailabilityApi() }),
    )
    vi.spyOn(AccountRepository, 'updateProfile')
    wrapper = mount(AccountProfileSection)

    await wrapper.find('input[name="accountProfile.username"]').setValue('ab')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(AccountRepository.updateProfile).not.toHaveBeenCalled()
    expect(form.getError('accountProfile.username')).toBe(
      'account_profile_section.error_username_size_min',
    )
  })
})
