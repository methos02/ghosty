import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const reportChapter = async (chapterId, formData) => {
  const response = await ReportRepository.reportChapter({
    params: ReportDto.toChapterParams(chapterId),
    body: ReportDto.toCreate(formData),
  })

  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, 'report')
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return { status: STATUS.SUCCESS }
}

export const ReportController = {
  reportChapter,
}
