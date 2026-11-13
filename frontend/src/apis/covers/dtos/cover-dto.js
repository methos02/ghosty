import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromCover = cover => {
  return {
    id: cover.id,
    novelId: cover.novel_id,
    imageUrl: cover.image_url,
    likeCount: cover.like_count,
    commentCount: cover.comment_count,
    isLiked: cover.is_liked === true,
    isReported: cover.is_reported === true,
    author: AuthorDto.fromShow(cover.author),
    createdAtFormat: dateHelper.formatDateLocal(cover.created_at, 'DD/MM/YYYY'),
  }
}

const fromCovers = covers => {
  return covers.map(cover => CoverDto.fromCover(cover))
}

const fromLike = like => {
  const likedCover = CoverDto.fromCover(like.cover)

  return {
    covers: like.moved_from ? [likedCover, CoverDto.fromCover(like.moved_from)] : [likedCover],
    officialCoverId: CoverDto.fromOfficialCoverId(like),
  }
}

const fromList = list => {
  return {
    covers: CoverDto.fromCovers(list.covers),
    officialCoverId: CoverDto.fromOfficialCoverId(list),
    myCoverId: list.my_cover_id ?? undefined,
  }
}

const fromOfficialCoverId = response => {
  return response.official_cover_id ?? undefined
}

const fromSummary = cover => {
  return cover ? { id: cover.id, imageUrl: cover.image_url } : undefined
}

const toCoverParams = coverId => {
  return { cover: coverId }
}

const toCreate = formData => {
  const body = new globalThis.FormData()
  body.append('image', formData.image)

  return body
}

const toNovelParams = novelSlug => {
  return { slug: novelSlug }
}

export const CoverDto = {
  fromCover,
  fromCovers,
  fromLike,
  fromList,
  fromOfficialCoverId,
  fromSummary,
  toCoverParams,
  toCreate,
  toNovelParams,
}
