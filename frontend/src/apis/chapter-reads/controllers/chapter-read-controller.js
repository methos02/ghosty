import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const create = async (chapter, sessionKey) => {
  const response = await ChapterReadRepository.create({
    params: ChapterReadDto.toChapterParams(chapter.id),
    body: ChapterReadDto.toCreate(sessionKey),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return { status: response.status }
}

const list = async (page = 1) => {
  const response = await ChapterReadRepository.list({
    params: ChapterReadDto.toListParams(page),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    reads: ChapterReadDto.fromList(response.data.reads),
    pagination: PaginationDto.fromMeta(response.data.meta),
  }
}

export const ChapterReadController = {
  create,
  list,
}
