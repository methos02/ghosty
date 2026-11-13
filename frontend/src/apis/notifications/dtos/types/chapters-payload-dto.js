import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'

const fromNotification = notification => {
  return {
    chapters: notification.chapters.map(chapter => ChapterDto.fromSummary(chapter)),
    count: notification.count,
  }
}

export const ChaptersPayloadDto = {
  fromNotification,
}
