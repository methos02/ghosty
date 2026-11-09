import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const create = async (chapter, sessionKey) => {
  const response = await ChapterReadRepository.create({
    params: ChapterReadDto.toChapterParams(chapter.id),
    body: ChapterReadDto.toCreate(sessionKey),
  })

  return controllerResponseHelper.buildResponse(response)
}

const list = async (page = 1) => {
  const response = await ChapterReadRepository.list({
    params: ChapterReadDto.toListParams(page),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    reads: ChapterReadDto.fromList(data.reads),
    pagination: PaginationDto.fromMeta(data.meta),
  }))
}

export const ChapterReadController = {
  create,
  list,
}
