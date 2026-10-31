import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const list = async (filters = {}) => {
  const response = await NovelRepository.list({
    params: NovelDto.toListParams({ page: 1, ...filters }),
  })
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
  const response = await NovelRepository.getBySlug({
    params: NovelDto.toShowParams(slug),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data),
  }
}

const create = async formData => {
  const response = await NovelRepository.create({
    body: NovelDto.toCreate(formData),
  })

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
  const response = await NovelRepository.update({
    params: NovelDto.toShowParams(slug),
    body: NovelDto.toUpdate(formData),
  })

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
