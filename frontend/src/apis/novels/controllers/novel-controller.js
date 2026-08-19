import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const list = async (filters = {}) => {
  const params = NovelDto.toListParams({ page: 1, ...filters })
  const response = await NovelRepository.list({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
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
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data),
  }
}

const create = async formData => {
  const body = NovelDto.toCreate(formData)
  const response = await NovelRepository.create({ body })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'novel')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data),
  }
}

const update = async (slug, formData) => {
  const params = NovelDto.toShowParams(slug)
  const body = NovelDto.toUpdate(formData)
  const response = await NovelRepository.update({ params, body })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'novel')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
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
  create,
  update,
}
