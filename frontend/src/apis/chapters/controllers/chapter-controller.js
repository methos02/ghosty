import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'

const mainContinuity = async novelSlug => {
  const params = ChapterDto.toMainContinuityParams(novelSlug)
  const response = await ChapterRepository.mainContinuity({ params })
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

const getById = async id => {
  const params = ChapterDto.toShowParams(id)
  const response = await ChapterRepository.getById({ params })
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapter: ChapterDto.fromShow(response.data),
  }
}

const children = async id => {
  const params = ChapterDto.toShowParams(id)
  const response = await ChapterRepository.children({ params })
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    chapters: ChapterDto.fromList(response.data.chapters),
  }
}

export const ChapterController = {
  mainContinuity,
  getById,
  children,
}
