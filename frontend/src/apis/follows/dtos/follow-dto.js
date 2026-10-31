import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromFollow = data => data.is_followed

const fromList = datas => datas.map(data => FollowDto.fromShow(data))

const fromShow = data => ({
  chapter: ChapterDto.fromShow(data.chapter),
  followedAt: data.followed_at,
  followedAtFormat: dateHelper.formatDateLocal(data.followed_at, 'DD/MM/YYYY'),
})

const toChapterParams = chapterId => ({ chapter: chapterId })

const toListParams = page => ({ page })

export const FollowDto = {
  fromFollow,
  fromList,
  fromShow,
  toChapterParams,
  toListParams,
}
