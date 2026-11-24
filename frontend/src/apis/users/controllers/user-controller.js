import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const listBranches = async (slug, page = 1) => {
  const response = await UserRepository.listBranches({
    params: UserDto.toListParams(slug, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromChapterList(data))
}

const listChapters = async (slug, page = 1) => {
  const response = await UserRepository.listChapters({
    params: UserDto.toListParams(slug, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromChapterList(data))
}

const listCovers = async (slug, page = 1) => {
  const response = await UserRepository.listCovers({
    params: UserDto.toListParams(slug, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromCoverList(data))
}

const listNovels = async (slug, page = 1) => {
  const response = await UserRepository.listNovels({
    params: UserDto.toListParams(slug, page),
  })

  return controllerResponseHelper.buildResponse(response, data => UserDto.fromNovelList(data))
}

const show = async slug => {
  const response = await UserRepository.show({
    params: UserDto.toProfileParams(slug),
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
