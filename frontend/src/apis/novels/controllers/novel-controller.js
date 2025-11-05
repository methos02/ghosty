import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const list = async () => {
  const response = await NovelRepository.list()
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    novels: NovelDto.fromList(response.data)
  }
}

export const NovelController = {
  list
}
