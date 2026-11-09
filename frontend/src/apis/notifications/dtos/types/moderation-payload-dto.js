import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'

const fromNotification = notification => {
  return {
    contentType: notification.content_type,
    resolution: notification.resolution,
    sanction: notification.sanction ? SanctionDto.fromSummary(notification.sanction) : undefined,
  }
}

export const ModerationPayloadDto = {
  fromNotification,
}
