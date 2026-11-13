import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const create = async (novelSlug, formData) => {
  const response = await CoverRepository.create({
    params: CoverDto.toNovelParams(novelSlug),
    body: CoverDto.toCreate(formData),
    form: 'cover',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    cover: CoverDto.fromCover(data.cover),
    officialCoverId: CoverDto.fromOfficialCoverId(data),
  }))
}

const like = async coverId => {
  const response = await CoverRepository.like({
    params: CoverDto.toCoverParams(coverId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    like: CoverDto.fromLike(data),
  }))
}

const list = async novelSlug => {
  const response = await CoverRepository.list({
    params: CoverDto.toNovelParams(novelSlug),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    novelCovers: CoverDto.fromList(data),
  }))
}

const replaceImage = async (coverId, formData) => {
  const response = await CoverRepository.replaceImage({
    params: CoverDto.toCoverParams(coverId),
    body: CoverDto.toCreate(formData),
    form: 'cover',
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    cover: CoverDto.fromCover(data.cover),
    officialCoverId: CoverDto.fromOfficialCoverId(data),
  }))
}

const unlike = async coverId => {
  const response = await CoverRepository.unlike({
    params: CoverDto.toCoverParams(coverId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    like: CoverDto.fromLike(data),
  }))
}

export const CoverController = {
  create,
  like,
  list,
  replaceImage,
  unlike,
}
