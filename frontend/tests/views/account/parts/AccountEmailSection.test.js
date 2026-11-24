import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountEmailSection from '@/views/account/parts/AccountEmailSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountEmailSection.vue', () => {
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
    vi.clearAllMocks()
  })

  it('changes the address with the current password and updates the connected user', async () => {
    const formData = accountSeeder.getEmailForm()
    const userApi = accountSeeder.getUpdatedUserApi({ email: formData.email })
    vi.spyOn(AccountRepository, 'updateEmail').mockResolvedValue(
      controllerSuccess({ data: userApi }),
    )
    wrapper = mount(AccountEmailSection)

    await wrapper.find('input[name="accountEmail.email"]').setValue(formData.email)
    await wrapper
      .find('input[name="accountEmail.currentPassword"]')
      .setValue(formData.currentPassword)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(AccountRepository.updateEmail).toHaveBeenCalledWith({
      body: AccountDto.toUpdateEmail(formData),
      form: 'accountEmail',
    })
    expect(useAuthStore().user.value).toEqual(AuthDto.fromUser(userApi))
    expect(wrapper.find('input[name="accountEmail.currentPassword"]').element.value).toBe('')
    expect(flash.getFlashes().at(-1).content).toBe(t('account_email_section.saved'))
  })

  it('does not send the address without the current password', async () => {
    vi.spyOn(AccountRepository, 'updateEmail')
    wrapper = mount(AccountEmailSection)

    await wrapper
      .find('input[name="accountEmail.email"]')
      .setValue(accountSeeder.getEmailForm().email)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(AccountRepository.updateEmail).not.toHaveBeenCalled()
    expect(form.getError('accountEmail.currentPassword')).toBe(
      'common.error_current_password_required',
    )
  })
})
