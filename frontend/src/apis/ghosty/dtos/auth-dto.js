import { OPTIONAL_NOTIFICATION_TYPES } from '@/constants/notification-constants.js'

const fromUser = user => {
  return {
    id: user.id,
    username: user.username,
    slug: user.slug,
    profileSlug: user.profile_slug,
    email: user.email,
    roles: user.roles,
    avatarUrl: user.avatar_url ?? undefined,
    notificationPreferences: internals.mapNotificationPreferences(user),
    newMessagesCount: user.new_messages_count,
    emailVerifiedAt: user.email_verified_at,
    createdAt: user.created_at,
  }
}

const toLogin = formData => {
  return {
    identifier: formData.identifier,
    password: formData.password,
  }
}

const toRegister = formData => {
  return {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.passwordConfirmation,
  }
}

export const AuthDto = {
  fromUser,
  toLogin,
  toRegister,
}

const mapNotificationPreferences = user => {
  const disabledTypes = user.disabled_notification_types ?? []

  return Object.fromEntries(
    OPTIONAL_NOTIFICATION_TYPES.map(type => [
      type,
      user.notifications_enabled && !disabledTypes.includes(type),
    ]),
  )
}

export const internals = {
  mapNotificationPreferences,
}
