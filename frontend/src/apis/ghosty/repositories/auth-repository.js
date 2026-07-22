import { req } from '@/services/shortcuts/services-shortcut.js'

const register = async data => {
  return await req('auth.register', { body: data })
}

const login = async data => {
  return await req('auth.login', { body: data })
}

const logout = async () => {
  return await req('auth.logout')
}

const me = async () => {
  return await req('auth.me')
}

export const AuthRepository = {
  register,
  login,
  logout,
  me,
}
