import { GenreRepository } from '@/apis/genres/repositories/genre-repository.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const list = async () => {
  const response = await GenreRepository.list()
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    genres: GenreDto.fromList(response.data),
  }
}

export const GenreController = { list }
