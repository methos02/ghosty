import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const list = async () => {
  const response = await ReadingProgressRepository.list({})
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    progresses: ReadingProgressDto.fromList(response.data.progresses),
  }
}

export const ReadingProgressController = {
  list,
}
