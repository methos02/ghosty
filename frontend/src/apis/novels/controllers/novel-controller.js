import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const list = async (page = 1) => {
  const params = NovelDto.toListParams(page)
  const response = await NovelRepository.list({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    novels: NovelDto.fromList(response.data.data),
    pagination: {
      nextPage : response.data.meta.current_page + 1,
      lastPage: response.data.meta.last_page
    }
  }
}

const getBySlug = async (slug) => {
  const params = NovelDto.toShowParams(slug)
  const response = await NovelRepository.getBySlug({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data)
  }
}

export const NovelController = {
  list,
  getBySlug
}
