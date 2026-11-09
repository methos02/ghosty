import { req } from '@/services/shortcuts/services-shortcut.js'

const register = async options => {
  return await req('auth.register', options)
}

const login = async options => {
  return await req('auth.login', options)
}

const logout = async () => {
  return await req('auth.logout')
}

const me = async options => {
  return await req('auth.me', options)
}

export const AuthRepository = {
  register,
  login,
  logout,
  me,
}
