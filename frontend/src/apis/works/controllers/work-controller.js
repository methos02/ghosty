import { WorkRepository } from '@/apis/works/repositories/work-repository.js'
import { WorkDto } from '@/apis/works/dtos/work-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'

const list = async (filters = {}) => {
  const response = await WorkRepository.list({ params: filters })
  if (response.status !== STATUS.SUCCESS) { return response }

  const data = response.data?.data || response.data
  const meta = response.data?.meta

  return {
    status: STATUS.SUCCESS,
    works: WorkDto.fromList(data),
    pagination: meta ? {
      page: meta.current_page,
      total: meta.total,
      size: meta.per_page,
      lastPage: meta.last_page
    } : null
  }
}

const getById = async (id) => {
  const params = WorkDto.toShowParams(id)
  const response = await WorkRepository.getById({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data)
  }
}

const getFirstChapter = async (novelSlug) => {
  const params = WorkDto.toChapterFilters(novelSlug, 1)
  const response = await WorkRepository.list({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  const data = response.data?.data || response.data
  const firstChapter = Array.isArray(data) && data.length > 0 ? data[0] : null
  if (!firstChapter) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(firstChapter)
  }
}

const getChapterByOrder = async (novelSlug, order) => {
  const params = WorkDto.toChapterFilters(novelSlug, order)
  const response = await WorkRepository.list({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  const data = response.data?.data || response.data
  const chapter = Array.isArray(data) && data.length > 0 ? data[0] : null
  if (!chapter) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(chapter)
  }
}

export const WorkController = {
  list,
  getById,
  getFirstChapter,
  getChapterByOrder
}
