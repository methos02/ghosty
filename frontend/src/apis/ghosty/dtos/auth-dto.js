const toRegister = datas => ({
  username: datas.username,
  email: datas.email,
  password: datas.password,
  password_confirmation: datas.passwordConfirmation,
})

const toLogin = datas => ({
  identifier: datas.identifier,
  password: datas.password,
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
