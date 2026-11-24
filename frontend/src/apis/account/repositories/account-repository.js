import { req } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

const checkUsernameAvailability = async options => {
  return await req('account.usernameAvailability', {
    ...options,
    'no-flash': [STATUS.UNPROCESSABLE_ENTITY],
  })
}

const deleteAvatar = async () => {
  return await req('account.deleteAvatar')
}

const destroy = async options => {
  return await req('account.destroy', options)
}

const updateEmail = async options => {
  return await req('account.updateEmail', options)
}

const updateNotifications = async options => {
  return await req('account.updateNotifications', options)
}

const updatePassword = async options => {
  return await req('account.updatePassword', options)
}

const updateProfile = async options => {
  return await req('account.updateProfile', options)
}

export const AccountRepository = {
  checkUsernameAvailability,
  deleteAvatar,
  destroy,
  updateEmail,
  updateNotifications,
  updatePassword,
  updateProfile,
}
