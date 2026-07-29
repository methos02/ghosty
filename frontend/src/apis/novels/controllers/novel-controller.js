import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'

const list = async (page = 1) => {
  const params = NovelDto.toListParams(page)
  const response = await NovelRepository.list({ params })
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  const { novels, meta } = response.data
  return {
    status: STATUS.SUCCESS,
    novels: NovelDto.fromList(novels),
    pagination: PaginationDto.fromMeta(meta),
  }
}

const getBySlug = async slug => {
  const params = NovelDto.toShowParams(slug)
  const response = await NovelRepository.getBySlug({ params })
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data),
  }
}

export const NovelController = {
  list,
  getBySlug,
}
