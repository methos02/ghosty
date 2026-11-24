import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const checkUsernameAvailability = async username => {
  const response = await AccountRepository.checkUsernameAvailability({
    params: AccountDto.toUsernameAvailabilityParams(username),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    isAvailable: AccountDto.fromUsernameAvailability(data),
  }))
}

const deleteAvatar = async () => {
  const response = await AccountRepository.deleteAvatar()

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data),
  }))
}

const destroy = async formData => {
  const response = await AccountRepository.destroy({
    body: AccountDto.toDestroy(formData),
    form: 'accountDeletion',
  })

  return controllerResponseHelper.buildResponse(response)
}

const updateEmail = async formData => {
  const response = await AccountRepository.updateEmail({
    body: AccountDto.toUpdateEmail(formData),
    form: 'accountEmail',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data),
  }))
}

const updateNotifications = async formData => {
  const response = await AccountRepository.updateNotifications({
    body: AccountDto.toUpdateNotifications(formData),
    form: 'accountNotifications',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data),
  }))
}

const updatePassword = async formData => {
  const response = await AccountRepository.updatePassword({
    body: AccountDto.toUpdatePassword(formData),
    form: 'accountPassword',
  })

  return controllerResponseHelper.buildResponse(response)
}

const updateProfile = async formData => {
  const response = await AccountRepository.updateProfile({
    body: AccountDto.toUpdateProfile(formData),
    form: 'accountProfile',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    user: AuthDto.fromUser(data),
  }))
}

export const AccountController = {
  checkUsernameAvailability,
  deleteAvatar,
  destroy,
  updateEmail,
  updateNotifications,
  updatePassword,
  updateProfile,
}
