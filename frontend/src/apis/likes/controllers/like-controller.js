import { LikeRepository } from '@/apis/likes/repositories/like-repository.js'
import { LikeDto } from '@/apis/likes/dtos/like-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const like = async chapterId => {
  const response = await LikeRepository.like({
    params: LikeDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    like: LikeDto.fromLike(data),
  }))
}

const unlike = async chapterId => {
  const response = await LikeRepository.unlike({
    params: LikeDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    like: LikeDto.fromLike(data),
  }))
}

export const LikeController = {
  like,
  unlike,
}
