const toRegister = formData => ({
  username: formData.username,
  email: formData.email,
  password: formData.password,
  password_confirmation: formData.passwordConfirmation,
})

const toLogin = formData => ({
  identifier: formData.identifier,
  password: formData.password,
})

const fromUser = data => ({
  id: data.id,
  username: data.username,
  email: data.email,
  roles: data.roles,
  avatar: data.avatar,
  firstname: data.firstname,
  lastname: data.lastname,
  birthDate: data.birth_date,
  notificationsEnabled: data.notifications_enabled,
  warningCount: data.warning_count,
  newMessagesCount: data.new_messages_count,
  bannedUntil: data.banned_until,
  emailVerifiedAt: data.email_verified_at,
  createdAt: data.created_at,
})

export const AuthDto = {
  toRegister,
  toLogin,
  fromUser,
}
