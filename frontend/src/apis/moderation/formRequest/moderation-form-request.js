import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { FormHelper } from '@/core/helpers/form-helper.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'

const isRemovalMissing = (content, datas) =>
  datas.resolution === RESOLUTIONS.PASSAGE_REMOVED
  && !content.includes(ConfigLoader.get('moderation.removedPassageMarker'))

const isSanctionMissing = (type, datas) => type === undefined && datas.isSanctionRequired === true

const isReasonMissing = (reason, datas) =>
  datas.sanction.type !== undefined && FormHelper.isEmpty(reason)

export const validateModerationForm = datas => {
  const rules = {
    resolution: {
      rules: 'required',
      errors: {
        required: 'moderation_decision.error_resolution_required',
      },
    },
    content: {
      rules: 'nothing_removed',
      tests: {
        nothing_removed: (content, formData) =>
          isRemovalMissing(content, formData) ? 'nothing_removed' : '',
      },
      errors: {
        nothing_removed: 'moderation_decision.error_nothing_removed',
      },
    },
    'sanction.type': {
      rules: 'required',
      format: formData => formData.sanction.type,
      tests: {
        required: (type, formData) => (isSanctionMissing(type, formData) ? 'required' : ''),
      },
      errors: {
        required: 'moderation_decision.error_sanction_required',
      },
    },
    'sanction.reason': {
      rules: `required|sizeMax:${ConfigLoader.get('moderation.reasonMaxLength')}`,
      format: formData => formData.sanction.reason,
      tests: {
        required: (reason, formData) => (isReasonMissing(reason, formData) ? 'required' : ''),
      },
      errors: {
        required: 'moderation_decision.error_sanction_reason_required',
        sizeMax: 'moderation_decision.error_sanction_reason_size_max',
      },
    },
  }

  return form.validate(rules, datas, { form: 'moderation' })
}
