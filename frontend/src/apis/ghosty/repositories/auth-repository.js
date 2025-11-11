import { req } from '@/services/services-helper.js'

const register = async (data) => {
  return await req('auth.register', data)
}

const login = async (data) => {
  return await req('auth.login', data)
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
  me
}
