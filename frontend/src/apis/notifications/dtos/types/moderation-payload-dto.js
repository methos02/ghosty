import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'

const fromNotification = notification => {
  return {
    contentType: notification.content_type,
    resolution: notification.resolution,
    sanction: notification.sanction ? SanctionDto.fromSummary(notification.sanction) : undefined,
    user: notification.user ? AuthorDto.fromShow(notification.user) : undefined,
  }
}

export const ModerationPayloadDto = {
  fromNotification,
}
