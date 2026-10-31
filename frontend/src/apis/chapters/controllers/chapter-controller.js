import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const children = async id => {
  const response = await ChapterRepository.children({
    params: ChapterDto.toChapterParams(id),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const create = async (novelSlug, formData) => {
  const response = await ChapterRepository.create({
    params: ChapterDto.toCreateParams(novelSlug),
    body: ChapterDto.toCreate(formData),
  })

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

const mainBranch = async novelSlug => {
  const response = await ChapterRepository.mainBranch({
    params: ChapterDto.toMainBranchParams(novelSlug),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const destroy = async id => {
  const response = await ChapterRepository.destroy({
    params: ChapterDto.toChapterParams(id),
  })

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return { status: STATUS.SUCCESS }
}

const drafts = async (filters = {}) => {
  const response = await ChapterRepository.drafts({
    params: ChapterDto.toDraftFilters(filters),
  })

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const getById = async id => {
  const response = await ChapterRepository.getById({
    params: ChapterDto.toChapterParams(id),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const publish = async id => {
  const response = await ChapterRepository.publish({
    params: ChapterDto.toChapterParams(id),
  })

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

const published = async () => {
  const response = await ChapterRepository.published()
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    novels: ChapterDto.fromPublished(response.data.novels),
  }
}

const reading = async (novelSlug, chapterId, options = {}) => {
  const response = await ChapterRepository.reading({
    params: ChapterDto.toReadingParams(novelSlug, chapterId),
    ...options,
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    ...ChapterDto.fromReading(response.data),
  }
}

const tree = async (novelSlug, fromChapterId, options = {}) => {
  const response = await ChapterRepository.tree({
    params: ChapterDto.toTreeParams(novelSlug, fromChapterId),
    ...options,
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    ...ChapterDto.fromTree(response.data),
  }
}

const update = async (id, formData) => {
  const response = await ChapterRepository.update({
    params: ChapterDto.toChapterParams(id),
    body: ChapterDto.toUpdate(formData),
  })

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

export const ChapterController = {
  children,
  create,
  mainBranch,
  destroy,
  drafts,
  getById,
  publish,
  published,
  reading,
  tree,
  update,
}
