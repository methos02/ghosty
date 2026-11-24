import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountNotificationsSection from '@/views/account/parts/AccountNotificationsSection.vue'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import {
  NOTIFICATION_PREFERENCE_GROUPS,
  NOTIFICATION_TYPES,
  OPTIONAL_NOTIFICATION_TYPES,
} from '@/constants/notification-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountNotificationsSection.vue', () => {
  let wrapper

  beforeEach(() => {
    useAuthStore().setUser(
      AuthDto.fromUser(
        userSeeder.getUserApi({
          disabled_notification_types: [NOTIFICATION_TYPES.LIKE_RECEIVED],
        }),
      ),
    )
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    form.clearErrors()
    flash.clearFlashes()
    vi.clearAllMocks()
  })

  it('titles every group of notifications', () => {
    wrapper = mount(AccountNotificationsSection)

    expect(
      wrapper.findAll('.account-notifications-section__group h3').map(title => title.text()),
    ).toEqual(
      Object.keys(NOTIFICATION_PREFERENCE_GROUPS).map(group =>
        t(`account_notifications_section.groups.${group}`),
      ),
    )
  })

  it('offers one switch per notification the user can disable', () => {
    wrapper = mount(AccountNotificationsSection)

    expect(wrapper.findAll('.account-notifications-section__types li')).toHaveLength(
      OPTIONAL_NOTIFICATION_TYPES.length,
    )
  })

  it('switches off the types the user already disabled', () => {
    wrapper = mount(AccountNotificationsSection)

    expect(
      [NOTIFICATION_TYPES.LIKE_RECEIVED, NOTIFICATION_TYPES.COMMENT_RECEIVED].map(
        type => wrapper.find(`input[name="accountNotifications.types.${type}"]`).element.checked,
      ),
    ).toEqual([false, true])
  })

  it('switches every type off when all notifications are turned off', async () => {
    wrapper = mount(AccountNotificationsSection)

    await wrapper.find('input[name="accountNotifications.notificationsEnabled"]').setValue(false)

    expect(
      wrapper
        .findAll('.account-notifications-section__types input')
        .some(input => input.element.checked),
    ).toBe(false)
  })

  it('turns notifications back on when one type is switched on again', async () => {
    wrapper = mount(AccountNotificationsSection)
    await wrapper.find('input[name="accountNotifications.notificationsEnabled"]').setValue(false)

    await wrapper
      .find(`input[name="accountNotifications.types.${NOTIFICATION_TYPES.COMMENT_REPLIED}"]`)
      .setValue(true)

    expect(
      wrapper.find('input[name="accountNotifications.notificationsEnabled"]').element.checked,
    ).toBe(true)
    expect(
      wrapper
        .findAll('.account-notifications-section__types input')
        .filter(input => input.element.checked)
        .map(input => input.attributes('name')),
    ).toEqual([`accountNotifications.types.${NOTIFICATION_TYPES.COMMENT_REPLIED}`])
  })

  it('switches every type on when all notifications are turned back on', async () => {
    wrapper = mount(AccountNotificationsSection)
    await wrapper.find('input[name="accountNotifications.notificationsEnabled"]').setValue(false)

    await wrapper.find('input[name="accountNotifications.notificationsEnabled"]').setValue(true)

    expect(
      wrapper
        .findAll('.account-notifications-section__types input')
        .every(input => input.element.checked),
    ).toBe(true)
  })

  it('saves the preferences and updates the connected user', async () => {
    const userApi = accountSeeder.getUpdatedUserApi({
      disabled_notification_types: [
        NOTIFICATION_TYPES.LIKE_RECEIVED,
        NOTIFICATION_TYPES.COMMENT_REPLIED,
      ],
    })
    vi.spyOn(AccountRepository, 'updateNotifications').mockResolvedValue(
      controllerSuccess({ data: userApi }),
    )
    wrapper = mount(AccountNotificationsSection)

    await wrapper
      .find(`input[name="accountNotifications.types.${NOTIFICATION_TYPES.COMMENT_REPLIED}"]`)
      .setValue(false)
    await wrapper.find('.account-notifications-section__save').trigger('click')
    await flushPromises()

    expect(AccountRepository.updateNotifications).toHaveBeenCalledWith({
      body: {
        notifications_enabled: true,
        disabled_notification_types: [
          NOTIFICATION_TYPES.LIKE_RECEIVED,
          NOTIFICATION_TYPES.COMMENT_REPLIED,
        ],
      },
      form: 'accountNotifications',
    })
    expect(useAuthStore().user.value).toEqual(AuthDto.fromUser(userApi))
    expect(flash.getFlashes().at(-1).content).toBe(t('account_notifications_section.saved'))
  })
})
