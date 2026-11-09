import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const list = async (filters = {}) => {
  const response = await NovelRepository.list({
    params: NovelDto.toListParams({ page: 1, ...filters }),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    novels: NovelDto.fromList(data.novels),
    pagination: PaginationDto.fromMeta(data.meta),
  }))
}

const getBySlug = async slug => {
  const response = await NovelRepository.getBySlug({
    params: NovelDto.toShowParams(slug),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    novel: NovelDto.fromShow(data),
  }))
}

const create = async formData => {
  const response = await NovelRepository.create({
    body: NovelDto.toCreate(formData),
    form: 'novel',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    novel: NovelDto.fromShow(data),
  }))
}

const update = async (slug, formData) => {
  const response = await NovelRepository.update({
    params: NovelDto.toShowParams(slug),
    body: NovelDto.toUpdate(formData),
    form: 'novel',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    novel: NovelDto.fromShow(data),
  }))
}

export const NovelController = {
  list,
  getBySlug,
  create,
  update,
}
