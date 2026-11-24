import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountDeletionSection from '@/views/account/parts/AccountDeletionSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { flash, form, router, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountDeletionSection.vue', () => {
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

  it('deletes the account once confirmed, signs out and goes back home', async () => {
    const formData = accountSeeder.getDeletionForm()
    vi.spyOn(AccountRepository, 'destroy').mockResolvedValue({ status: STATUS.NO_CONTENT })
    const push = vi.spyOn(router, 'push').mockResolvedValueOnce()
    wrapper = mount(AccountDeletionSection)

    await wrapper
      .find('input[name="accountDeletion.currentPassword"]')
      .setValue(formData.currentPassword)
    await wrapper.find('.account-deletion-section__delete').trigger('click')
    expect(AccountRepository.destroy).not.toHaveBeenCalled()
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(AccountRepository.destroy).toHaveBeenCalledWith({
      body: AccountDto.toDestroy(formData),
      form: 'accountDeletion',
    })
    expect(useAuthStore().isAuthenticated.value).toBe(false)
    expect(push).toHaveBeenCalledWith({ name: 'home' })
    expect(flash.getFlashes().at(-1).content).toBe(t('account_deletion_section.deleted'))
  })

  it('keeps the account signed in when the current password is wrong', async () => {
    vi.spyOn(AccountRepository, 'destroy').mockResolvedValue(
      controllerError(STATUS.UNPROCESSABLE_ENTITY),
    )
    wrapper = mount(AccountDeletionSection)

    await wrapper
      .find('input[name="accountDeletion.currentPassword"]')
      .setValue(accountSeeder.getDeletionForm().currentPassword)
    await wrapper.find('.account-deletion-section__delete').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(useAuthStore().isAuthenticated.value).toBe(true)
  })

  it('does not delete the account without the current password', async () => {
    vi.spyOn(AccountRepository, 'destroy')
    wrapper = mount(AccountDeletionSection)

    await wrapper.find('.account-deletion-section__delete').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(AccountRepository.destroy).not.toHaveBeenCalled()
    expect(form.getError('accountDeletion.currentPassword')).toBe(
      'common.error_current_password_required',
    )
  })
})
