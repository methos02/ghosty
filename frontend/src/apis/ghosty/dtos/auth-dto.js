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

const fromUser = userData => ({
  id: userData.id,
  username: userData.username,
  email: userData.email,
  roles: userData.roles,
  avatar: userData.avatar,
  firstname: userData.firstname,
  lastname: userData.lastname,
  birthDate: userData.birth_date,
  notificationsEnabled: userData.notifications_enabled,
  warningCount: userData.warning_count,
  newMessagesCount: userData.new_messages_count,
  bannedUntil: userData.banned_until,
  emailVerifiedAt: userData.email_verified_at,
  createdAt: userData.created_at,
})

export const AuthDto = {
  toRegister,
  toLogin,
  fromUser,
}
