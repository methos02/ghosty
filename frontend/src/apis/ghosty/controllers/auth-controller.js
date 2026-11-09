import { AuthRepository } from '@/apis/ghosty/repositories/auth-repository.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const register = async datas => {
  const response = await AuthRepository.register({
    body: AuthDto.toRegister(datas),
    form: 'register',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data.user),
  }))
}

const login = async datas => {
  const response = await AuthRepository.login({
    body: AuthDto.toLogin(datas),
    form: 'login',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data.user),
  }))
}

const logout = async () => {
  const response = await AuthRepository.logout()

  return controllerResponseHelper.buildResponse(response, data => ({
    message: data.message,
  }))
}

const me = async (options = {}) => {
  const response = await AuthRepository.me(options)

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data.user),
  }))
}

export const AuthController = {
  register,
  login,
  logout,
  me,
}
