import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountPasswordSection from '@/views/account/parts/AccountPasswordSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('AccountPasswordSection.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
    flash.clearFlashes()
    vi.clearAllMocks()
  })

  it('changes the password, empties the fields and confirms', async () => {
    const formData = accountSeeder.getPasswordForm()
    vi.spyOn(AccountRepository, 'updatePassword').mockResolvedValue({ status: STATUS.NO_CONTENT })
    wrapper = mount(AccountPasswordSection)

    await wrapper
      .find('input[name="accountPassword.currentPassword"]')
      .setValue(formData.currentPassword)
    await wrapper.find('input[name="accountPassword.password"]').setValue(formData.password)
    await wrapper
      .find('input[name="accountPassword.passwordConfirmation"]')
      .setValue(formData.passwordConfirmation)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(AccountRepository.updatePassword).toHaveBeenCalledWith({
      body: AccountDto.toUpdatePassword(formData),
      form: 'accountPassword',
    })
    expect(wrapper.find('input[name="accountPassword.password"]').element.value).toBe('')
    expect(flash.getFlashes().at(-1).content).toBe(t('account_password_section.saved'))
  })

  it('does not send a confirmation that differs from the new password', async () => {
    const formData = accountSeeder.getPasswordForm()
    vi.spyOn(AccountRepository, 'updatePassword')
    wrapper = mount(AccountPasswordSection)

    await wrapper
      .find('input[name="accountPassword.currentPassword"]')
      .setValue(formData.currentPassword)
    await wrapper.find('input[name="accountPassword.password"]').setValue(formData.password)
    await wrapper
      .find('input[name="accountPassword.passwordConfirmation"]')
      .setValue('AutreChose789!')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(AccountRepository.updatePassword).not.toHaveBeenCalled()
    expect(form.getError('accountPassword.passwordConfirmation')).toBe(
      'account_password_section.error_password_confirmation_match',
    )
  })
})
