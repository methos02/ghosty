import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const listBranches = async (username, page = 1) => {
  const response = await UserRepository.listBranches({
    params: UserDto.toListParams(username, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromChapterList(data))
}

const listChapters = async (username, page = 1) => {
  const response = await UserRepository.listChapters({
    params: UserDto.toListParams(username, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromChapterList(data))
}

const listCovers = async (username, page = 1) => {
  const response = await UserRepository.listCovers({
    params: UserDto.toListParams(username, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromCoverList(data))
}

const listNovels = async (username, page = 1) => {
  const response = await UserRepository.listNovels({
    params: UserDto.toListParams(username, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromNovelList(data))
}

const show = async username => {
  const response = await UserRepository.show({
    params: UserDto.toProfileParams(username),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    profile: UserDto.fromProfile(data),
  }))
}

export const UserController = {
  listBranches,
  listChapters,
  listCovers,
  listNovels,
  show,
}
