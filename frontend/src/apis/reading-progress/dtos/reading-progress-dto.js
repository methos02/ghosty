import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromList = datas => datas.map(data => ReadingProgressDto.fromShow(data))

const fromShow = data => ({
  chapter: ChapterDto.fromShow(data.chapter),
  readAt: data.read_at,
  readAtFormat: dateHelper.formatDateLocal(data.read_at, 'DD/MM/YYYY'),
})

export const ReadingProgressDto = {
  fromList,
  fromShow,
}
