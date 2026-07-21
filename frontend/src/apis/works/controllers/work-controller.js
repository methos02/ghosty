import { WorkRepository } from '@/apis/works/repositories/work-repository.js'
import { WorkDto } from '@/apis/works/dtos/work-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'

const list = async (filters = {}) => {
  const response = await WorkRepository.list({ params: filters })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    works: WorkDto.fromList(response.data.data),
    pagination: PaginationDto.fromMeta(response.data.meta),
  }
}

const getById = async (id) => {
  const params = WorkDto.toShowParams(id)
  const response = await WorkRepository.getById({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data),
  }
}

const getChapterByOrder = async (novelSlug, order) => {
  const params = WorkDto.toChapterFilters(novelSlug, order)
  const response = await WorkRepository.list({ params })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data.data[0]),
  }
}

const getFirstChapter = async (novelSlug) => getChapterByOrder(novelSlug, 1)

const create = async (workData) => {
  const body = WorkDto.toCreate(workData)
  const response = await WorkRepository.create({ body })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data),
  }
}

const update = async (id, workData) => {
  const body = WorkDto.toUpdate(workData)
  const response = await WorkRepository.update({ params: { id }, body })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data),
  }
}

const vote = async (id, value) => {
  const body = WorkDto.toVote(value)
  const response = await WorkRepository.vote({ params: { id }, body })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    work: WorkDto.fromShow(response.data),
  }
}

export const WorkController = {
  list,
  getById,
  getFirstChapter,
  getChapterByOrder,
  create,
  update,
  vote,
}
