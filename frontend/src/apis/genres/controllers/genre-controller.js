import { GenreRepository } from '@/apis/genres/repositories/genre-repository.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const list = async () => {
  const response = await GenreRepository.list()

  return controllerResponseHelper.buildResponse(response, data => ({
    genres: GenreDto.fromList(data),
  }))
}

export const GenreController = { list }
