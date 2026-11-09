import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const children = async id => {
  const response = await ChapterRepository.children({
    params: ChapterDto.toChapterParams(id),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapters: ChapterDto.fromList(data.chapters),
  }))
}

const create = async (novelSlug, formData) => {
  const response = await ChapterRepository.create({
    params: ChapterDto.toCreateParams(novelSlug),
    body: ChapterDto.toCreate(formData),
    form: 'chapter',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapter: ChapterDto.fromShow(data),
  }))
}

const mainBranch = async novelSlug => {
  const response = await ChapterRepository.mainBranch({
    params: ChapterDto.toMainBranchParams(novelSlug),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapters: ChapterDto.fromList(data.chapters),
  }))
}

const destroy = async id => {
  const response = await ChapterRepository.destroy({
    params: ChapterDto.toChapterParams(id),
  })

  return controllerResponseHelper.buildResponse(response)
}

const drafts = async (filters = {}) => {
  const response = await ChapterRepository.drafts({
    params: ChapterDto.toDraftFilters(filters),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapters: ChapterDto.fromList(data.chapters),
  }))
}

const getById = async id => {
  const response = await ChapterRepository.getById({
    params: ChapterDto.toChapterParams(id),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapter: ChapterDto.fromShow(data),
  }))
}

const publish = async id => {
  const response = await ChapterRepository.publish({
    params: ChapterDto.toChapterParams(id),
    form: 'chapter',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapter: ChapterDto.fromShow(data),
  }))
}

const published = async () => {
  const response = await ChapterRepository.published()

  return controllerResponseHelper.buildResponse(response, data => ({
    novels: ChapterDto.fromPublished(data.novels),
  }))
}

const reading = async (novelSlug, chapterId, options = {}) => {
  const response = await ChapterRepository.reading({
    params: ChapterDto.toReadingParams(novelSlug, chapterId),
    ...options,
  })

  return controllerResponseHelper.buildResponse(response, data => ChapterDto.fromReading(data))
}

const tree = async (novelSlug, fromChapterId, options = {}) => {
  const response = await ChapterRepository.tree({
    params: ChapterDto.toTreeParams(novelSlug, fromChapterId),
    ...options,
  })

  return controllerResponseHelper.buildResponse(response, data => ChapterDto.fromTree(data))
}

const update = async (id, formData) => {
  const response = await ChapterRepository.update({
    params: ChapterDto.toChapterParams(id),
    body: ChapterDto.toUpdate(formData),
    form: 'chapter',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    chapter: ChapterDto.fromShow(data),
  }))
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
