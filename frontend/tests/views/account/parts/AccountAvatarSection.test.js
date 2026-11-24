import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountAvatarSection from '@/views/account/parts/AccountAvatarSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { flash, form } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountAvatarSection.vue', () => {
  let wrapper

  beforeAll(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:avatar-source')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  afterAll(() => {
    delete globalThis.URL.createObjectURL
    delete globalThis.URL.revokeObjectURL
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    form.clearErrors()
    flash.clearFlashes()
    vi.clearAllMocks()
  })

  it('shows an icon while the user has no avatar', () => {
    wrapper = mount(AccountAvatarSection)

    expect(wrapper.find('.account-avatar-section__avatar--empty').exists()).toBe(true)
    expect(wrapper.find('.account-avatar-section__delete').exists()).toBe(false)
  })

  it('opens the file picker when the avatar is clicked', async () => {
    wrapper = mount(AccountAvatarSection)
    const click = vi.spyOn(wrapper.find('.account-avatar-section__input').element, 'click')

    await wrapper.find('.account-avatar-section__picker').trigger('click')

    expect(click).toHaveBeenCalledOnce()
  })

  it('opens a round cropper without hint nor apply button on the chosen image', async () => {
    wrapper = mount(AccountAvatarSection)
    const input = wrapper.find('.account-avatar-section__input')
    Object.defineProperty(input.element, 'files', {
      value: [accountSeeder.getAvatarImageFile()],
    })

    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.image-cropper').exists()).toBe(true))

    expect(
      [
        '.image-cropper__frame--round',
        '.image-cropper__cancel',
        '.image-cropper__hint',
        '.image-cropper__apply',
      ].map(selector => wrapper.find(selector).exists()),
    ).toEqual([true, true, false, false])
  })

  it('gives up the chosen image on cancel', async () => {
    wrapper = mount(AccountAvatarSection)
    const input = wrapper.find('.account-avatar-section__input')
    Object.defineProperty(input.element, 'files', {
      value: [accountSeeder.getAvatarImageFile()],
    })
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.find('.image-cropper').exists()).toBe(true))

    await wrapper.find('.image-cropper__cancel').trigger('click')

    expect(wrapper.find('.image-cropper').exists()).toBe(false)
    expect(wrapper.vm.hasPendingImage()).toBe(false)
  })

  it('refuses an image too small for a square avatar', async () => {
    wrapper = mount(AccountAvatarSection)
    const input = wrapper.find('.account-avatar-section__input')
    Object.defineProperty(input.element, 'files', {
      value: [accountSeeder.getAvatarImageFile({ width: 150, height: 150 })],
    })

    await input.trigger('change')
    await flushPromises()

    expect(wrapper.find('.image-cropper').exists()).toBe(false)
    expect(form.getError('accountProfile.image')).toBe('account_avatar_section.error_too_small')
  })

  it('deletes the avatar once confirmed', async () => {
    const userApi = userSeeder.getUserApi()
    useAuthStore().setUser(userSeeder.getUserWithAvatar())
    vi.spyOn(AccountRepository, 'deleteAvatar').mockResolvedValue(
      controllerSuccess({ data: userApi }),
    )
    wrapper = mount(AccountAvatarSection)

    await wrapper.find('.account-avatar-section__delete').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(AccountRepository.deleteAvatar).toHaveBeenCalled()
    expect(useAuthStore().user.value).toEqual(AuthDto.fromUser(userApi))
    expect(wrapper.find('.account-avatar-section__avatar--empty').exists()).toBe(true)
  })
})
