import { OPTIONAL_NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

const fromUsernameAvailability = availability => {
  return availability.available
}

const toDestroy = formData => {
  return { current_password: formData.currentPassword }
}

const toUpdateEmail = formData => {
  return {
    email: formData.email,
    current_password: formData.currentPassword,
  }
}

const toUpdateNotifications = formData => {
  return {
    notifications_enabled: OPTIONAL_NOTIFICATION_TYPES.some(type => formData.types[type] === true),
    disabled_notification_types: OPTIONAL_NOTIFICATION_TYPES.filter(
      type => formData.types[type] === false,
    ),
  }
}

const toUpdatePassword = formData => {
  return {
    current_password: formData.currentPassword,
    password: formData.password,
    password_confirmation: formData.passwordConfirmation,
  }
}

const toUpdateProfile = formData => {
  const body = new globalThis.FormData()
  body.append('username', formData.username)

  if (formData.image !== undefined) {
    body.append('image', formData.image)
  }

  return body
}

const toUsernameAvailabilityParams = username => {
  return { username }
}

export const AccountDto = {
  fromUsernameAvailability,
  toDestroy,
  toUpdateEmail,
  toUpdateNotifications,
  toUpdatePassword,
  toUpdateProfile,
  toUsernameAvailabilityParams,
}
