import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const currentContinuity = async novelSlug => {
  const params = ChapterDto.toCurrentContinuityParams(novelSlug)
  const response = await ChapterRepository.currentContinuity({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const getById = async id => {
  const params = ChapterDto.toChapterParams(id)
  const response = await ChapterRepository.getById({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const children = async id => {
  const params = ChapterDto.toChapterParams(id)
  const response = await ChapterRepository.children({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const create = async (novelSlug, formData) => {
  const params = ChapterDto.toCreateParams(novelSlug)
  const body = ChapterDto.toCreate(formData)
  const response = await ChapterRepository.create({ params, body })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'chapter')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const update = async (id, formData) => {
  const params = ChapterDto.toChapterParams(id)
  const body = ChapterDto.toUpdate(formData)
  const response = await ChapterRepository.update({ params, body })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'chapter')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const publish = async id => {
  const params = ChapterDto.toChapterParams(id)
  const response = await ChapterRepository.publish({ params })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'chapter')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const destroy = async id => {
  const params = ChapterDto.toChapterParams(id)
  const response = await ChapterRepository.destroy({ params })

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return { status: STATUS.SUCCESS }
}

const drafts = async (filters = {}) => {
  const params = ChapterDto.toDraftFilters(filters)
  const response = await ChapterRepository.drafts({ params })

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

export const ChapterController = {
  currentContinuity,
  getById,
  children,
  create,
  update,
  publish,
  destroy,
  drafts,
}
