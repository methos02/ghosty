import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const follow = async chapterId => {
  const response = await FollowRepository.follow({
    params: FollowDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    isFollowed: FollowDto.fromFollow(data),
  }))
}

const list = async (page = 1) => {
  const response = await FollowRepository.list({
    params: FollowDto.toListParams(page),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    follows: FollowDto.fromList(data.follows),
    pagination: PaginationDto.fromMeta(data.meta),
  }))
}

const unfollow = async chapterId => {
  const response = await FollowRepository.unfollow({
    params: FollowDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    isFollowed: FollowDto.fromFollow(data),
  }))
}

export const FollowController = {
  follow,
  list,
  unfollow,
}
