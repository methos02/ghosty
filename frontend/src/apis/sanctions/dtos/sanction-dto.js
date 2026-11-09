import { dateHelper } from '@/core/helpers/date-helper.js'

const fromList = sanctions => sanctions.map(sanction => SanctionDto.fromShow(sanction))

const fromShow = sanction => ({
  ...SanctionDto.fromSummary(sanction),
  id: sanction.id,
  createdAtFormat: dateHelper.formatDateLocal(sanction.created_at),
})

const fromSummary = sanction => ({
  type: sanction.type,
  isPermanent: sanction.until === null,
  untilFormat: sanction.until === null ? '' : dateHelper.formatDateLocal(sanction.until),
  reason: sanction.reason ?? '',
})

const toCreate = sanction =>
  sanction.type === undefined
    ? undefined
    : {
        type: sanction.type,
        days: sanction.days,
        reason: sanction.reason,
      }

export const SanctionDto = {
  fromList,
  fromShow,
  fromSummary,
  toCreate,
}
