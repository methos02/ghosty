import { LikeRepository } from '@/apis/likes/repositories/like-repository.js'
import { LikeDto } from '@/apis/likes/dtos/like-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const like = async chapterId => {
  const params = LikeDto.toChapterParams(chapterId)
  const response = await LikeRepository.like({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    like: LikeDto.fromLike(response.data),
  }
}

const unlike = async chapterId => {
  const params = LikeDto.toChapterParams(chapterId)
  const response = await LikeRepository.unlike({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    like: LikeDto.fromLike(response.data),
  }
}

export const LikeController = {
  like,
  unlike,
}
