import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const list = async (page = 1) => {
  const response = await NovelRepository.list({ params: { page } })

  if (response.status !== STATUS.SUCCESS) {
    return {
      status: STATUS.ERROR,
      error: response.error || 'Erreur lors du chargement des romans'
    }
  }

  return {
    status: STATUS.SUCCESS,
    novels: NovelDto.fromList(response.data.data),
    pagination: {
      nextPage : response.data.meta.current_page + 1,
      lastPage: response.data.meta.last_page
    }
  }
}

export const NovelController = {
  list
}
