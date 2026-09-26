import { req } from '@/services/shortcuts/services-shortcut.js'
import { REPORT_GUARD_STATUSES } from '@/constants/report-constants.js'

const reportChapter = async options => {
  return await req('chapter.report', { ...options, 'no-flash': REPORT_GUARD_STATUSES })
}

export const ReportRepository = {
  reportChapter,
}
