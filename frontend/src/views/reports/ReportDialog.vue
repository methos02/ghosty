<script setup>
import { computed, ref, watch } from 'vue'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { STATUS } from '@/constants/ajax-constants.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { validateReportForm } from '@/apis/reports/formRequest/report-form-request.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const { reportedContent, report } = useReport()

const dialog = ref()
const datas = ref({})
const refusal = ref('')
const sendButton = ref()

const isComment = computed(() => reportedContent.value?.type === REPORTED_CONTENT_TYPES.COMMENT)

const isCover = computed(() => reportedContent.value?.type === REPORTED_CONTENT_TYPES.COVER)

const reasonsKey = computed(() => {
  if (isComment.value) {
    return 'report.commentReasons'
  }

  return isCover.value ? 'report.coverReasons' : 'report.chapterReasons'
})

const reasons = computed(() => ConfigLoader.get(reasonsKey.value))

const alreadyReported = computed(() => {
  if (reportedContent.value === undefined) {
    return false
  }

  return report.isAlreadyReported(reportedContent.value)
})

watch(reportedContent, reported => {
  dialog.value?.toggle(reported !== undefined)

  if (reported === undefined) {
    return
  }

  datas.value = {}
  refusal.value = ''
  form.clearErrors()
})

const sendReport = reported => {
  if (reported.type === REPORTED_CONTENT_TYPES.COMMENT) {
    return ReportController.reportComment(reported.content.id, datas.value)
  }

  if (reported.type === REPORTED_CONTENT_TYPES.COVER) {
    return ReportController.reportCover(reported.content.id, datas.value)
  }

  return ReportController.reportChapter(reported.content.id, datas.value)
}

const send = async () => {
  form.clearErrors()
  refusal.value = ''

  const validation = validateReportForm(datas.value)
  if (!validation.valid) {
    return
  }

  const reported = reportedContent.value
  const response = await sendReport(reported)

  if (response.status === STATUS.CONFLICT) {
    report.markAsReported(reported)
    return
  }

  if (response.status === STATUS.NOT_FOUND) {
    refusal.value = t('report_dialog.error_gone')
    return
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    refusal.value = response.data.message ?? t('report_dialog.error_send')
    return
  }

  report.markAsReported(reported)
  flash.successT('report_dialog.sent')
  report.closeReport()
}
</script>

<template>
  <DialogComponent
    ref="dialog"
    @dialog-close="report.closeReport"
  >
    <template #title>
      <template v-if="reportedContent !== undefined">
        <template v-if="isComment">
          {{
            t('report_dialog.title_comment', {
              author: reportedContent.content.author.username,
            })
          }}
        </template>
        <template v-else-if="isCover">
          {{
            t('report_dialog.title_cover', {
              author: reportedContent.content.author.username,
            })
          }}
        </template>
        <template v-else>
          {{ t('report_dialog.title_chapter', { chapter: reportedContent.content.title }) }}
        </template>
      </template>
    </template>

    <div
      v-if="alreadyReported"
      class="report-dialog | d-flex f-column g-15"
    >
      <p
        v-if="isComment"
        class="report-dialog__already | bg-info-300 p-10 radius-5"
      >
        {{ t('report_dialog.already_comment') }}
      </p>
      <p
        v-else-if="isCover"
        class="report-dialog__already | bg-info-300 p-10 radius-5"
      >
        {{ t('report_dialog.already_cover') }}
      </p>
      <p
        v-else
        class="report-dialog__already | bg-info-300 p-10 radius-5"
      >
        {{ t('report_dialog.already_chapter') }}
      </p>

      <button
        type="button"
        class="report-dialog__close | btn btn-primary"
        @click="report.closeReport"
      >
        {{ t('report_dialog.close') }}
      </button>
    </div>

    <form
      v-if="!alreadyReported"
      class="report-dialog | d-flex f-column g-15"
      @submit.prevent="sendButton?.runCallback()"
    >
      <p
        v-if="isComment"
        class="report-dialog__intro | fs-300 color-neutral-700"
      >
        {{ t('report_dialog.intro_comment') }}
      </p>
      <p
        v-else-if="isCover"
        class="report-dialog__intro | fs-300 color-neutral-700"
      >
        {{ t('report_dialog.intro_cover') }}
      </p>
      <p
        v-else
        class="report-dialog__intro | fs-300 color-neutral-700"
      >
        {{ t('report_dialog.intro_chapter') }}
      </p>

      <SelectComponent
        v-model="datas.reason"
        name="reason"
        :label="t('report_dialog.reason')"
        :required="true"
        form="report"
      >
        <option
          v-for="reason in reasons"
          :key="reason"
          :value="reason"
        >
          {{ t(`common.report_reasons.${reason}`) }}
        </option>
      </SelectComponent>

      <TextareaComponent
        v-model="datas.description"
        name="description"
        :label="t('report_dialog.description')"
        :maxLength="ConfigLoader.get('report.descriptionMaxLength')"
        :autogrow="true"
        form="report"
      />

      <p
        v-if="refusal !== ''"
        class="report-dialog__refusal | bg-danger-100 p-10 radius-5 color-danger"
      >
        {{ refusal }}
      </p>

      <LoaderComponent
        ref="sendButton"
        :cb="send"
        buttonType="submit"
        buttonClasses="btn btn-primary"
      >
        {{ t('report_dialog.send') }}
      </LoaderComponent>
    </form>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.report-dialog {
  width: 100vw;
  max-width: 480px;
}
</style>
