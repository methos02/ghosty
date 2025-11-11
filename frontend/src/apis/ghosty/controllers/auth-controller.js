import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { AuthErrorDto } from '@/apis/ghosty/dtos/auth-error-dto.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'
import { form } from '@/services/services-helper.js'

const register = async (datas) => {
  const data = AuthDto.toRegister(datas)
  const response = await AuthRepository.register(data)

  if (response.status === STATUS.VALIDATION_ERROR) {
    form.addErrors(AuthErrorDto.registerFields(response.data.validationErrors))
    return { status: STATUS.ERROR }
  }

  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user),
    token: response.data.token
  }
}

const login = async (datas) => {
  const data = AuthDto.toLogin(datas)
  const response = await AuthRepository.login(data)

  if (response.status === STATUS.VALIDATION_ERROR) {
    form.addErrors(AuthErrorDto.loginFields(response.data.validationErrors))
    return { status: STATUS.ERROR }
  }

  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user),
    token: response.data.token
  }
}

const logout = async () => {
  const response = await AuthRepository.logout()
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    message: response.data.message
  }
}

const me = async () => {
  const response = await AuthRepository.me()
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    user: AuthDto.fromUser(response.data.user)
  }
}

export const AuthController = {
  register,
  login,
  logout,
  me
}
