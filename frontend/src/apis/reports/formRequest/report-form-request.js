import { form } from '@/services/shortcuts/services-shortcut.js'
import { reportConfig } from '@/config/report-config.js'

export const validateReportForm = datas => {
  const rules = {
    reason: {
      rules: 'required',
      errors: {
        required: 'report_dialog.error_reason_required',
      },
    },
    description: {
      rules: `sizeMax:${reportConfig.descriptionMaxLength}`,
      errors: {
        sizeMax: 'report_dialog.error_description_size_max',
      },
    },
  }

  return form.validate(rules, datas, { form: 'report' })
}
