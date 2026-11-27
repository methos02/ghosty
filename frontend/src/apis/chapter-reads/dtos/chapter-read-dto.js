import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { DATETIME_FORMAT } from '@/constants/utils-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromList = datas => datas.map(data => ChapterReadDto.fromShow(data))

const fromShow = data => ({
  chapter: ChapterDto.fromShow(data.chapter),
  readAt: data.read_at,
  readAtFormat: dateHelper.formatDateLocal(data.read_at, DATETIME_FORMAT),
})

const toChapterParams = chapterId => ({ chapter: chapterId })

const toCreate = sessionKey => ({ session_key: sessionKey })

const toListParams = page => ({ page })

export const ChapterReadDto = {
  fromList,
  fromShow,
  toChapterParams,
  toCreate,
  toListParams,
}
