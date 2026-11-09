import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const list = async () => {
  const response = await ReadingProgressRepository.list({})

  return controllerResponseHelper.buildResponse(response, data => ({
    progresses: ReadingProgressDto.fromList(data.progresses),
  }))
}

export const ReadingProgressController = {
  list,
}
