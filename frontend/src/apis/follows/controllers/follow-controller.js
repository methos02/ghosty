import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const follow = async chapterId => {
  const response = await FollowRepository.follow({
    params: FollowDto.toChapterParams(chapterId),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    isFollowed: FollowDto.fromFollow(response.data),
  }
}

const list = async (page = 1) => {
  const response = await FollowRepository.list({
    params: FollowDto.toListParams(page),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    follows: FollowDto.fromList(response.data.follows),
    pagination: PaginationDto.fromMeta(response.data.meta),
  }
}

const unfollow = async chapterId => {
  const response = await FollowRepository.unfollow({
    params: FollowDto.toChapterParams(chapterId),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    isFollowed: FollowDto.fromFollow(response.data),
  }
}

export const FollowController = {
  follow,
  list,
  unfollow,
}
