import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const register = async datas => {
  const data = AuthDto.toRegister(datas)
  const response = await AuthRepository.register(data)

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'register')
  }

  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user),
  }
}

const login = async datas => {
  const data = AuthDto.toLogin(datas)
  const response = await AuthRepository.login(data)

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'login')
  }

  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user),
  }
}

const logout = async () => {
  const response = await AuthRepository.logout()
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    message: response.data.message,
  }
}

const me = async (options = {}) => {
  const response = await AuthRepository.me(options)
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user),
  }
}

export const AuthController = {
  register,
  login,
  logout,
  me,
}
