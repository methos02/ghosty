<script setup>
import { computed, ref, watch } from 'vue'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { STATUS } from '@/constants/ajax-constants.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { validateReportForm } from '@/apis/reports/formRequest/report-form-request.js'
import { useChapterReport } from '@/apis/reports/composables/use-chapter-report.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const { reportedChapter, closeChapterReport, isAlreadyReported, markAsReported } =
  useChapterReport()

const dialog = ref()
const datas = ref({})
const refusal = ref('')
const sendButton = ref()

const alreadyReported = computed(() => {
  if (reportedChapter.value === undefined) {
    return false
  }

  return isAlreadyReported(reportedChapter.value)
})

watch(reportedChapter, chapter => {
  dialog.value?.toggle(chapter !== undefined)

  if (chapter === undefined) {
    return
  }

  datas.value = {}
  refusal.value = ''
  form.clearErrors()
})

const send = async () => {
  form.clearErrors()
  refusal.value = ''

  const validation = validateReportForm(datas.value)
  if (!validation.valid) {
    return
  }

  const chapterId = reportedChapter.value.id
  const response = await ReportController.reportChapter(chapterId, datas.value)

  if (response.status === STATUS.CONFLICT) {
    markAsReported(chapterId)
    return
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    refusal.value = response.data.message ?? t('report_dialog.error_send')
    return
  }

  markAsReported(chapterId)
  flash.successT('report_dialog.sent')
  closeChapterReport()
}
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="t('report_dialog.title', { chapter: reportedChapter?.title ?? '' })"
    @dialog-close="closeChapterReport"
  >
    <div
      v-if="alreadyReported"
      class="report-dialog | d-flex f-column g-15"
    >
      <p class="report-dialog__already | bg-info-300 p-10 radius-5">
        {{ t('report_dialog.already') }}
      </p>

      <button
        type="button"
        class="report-dialog__close | btn btn-primary"
        @click="closeChapterReport"
      >
        {{ t('report_dialog.close') }}
      </button>
    </div>

    <form
      v-if="!alreadyReported"
      class="report-dialog | d-flex f-column g-15"
      @submit.prevent="sendButton?.runCallback()"
    >
      <p class="report-dialog__intro | fs-300 color-neutral-700">
        {{ t('report_dialog.intro') }}
      </p>

      <SelectComponent
        v-model="datas.reason"
        name="reason"
        :label="t('report_dialog.reason')"
        :required="true"
        form="report"
      >
        <option
          v-for="reason in ConfigLoader.get('report.chapterReasons')"
          :key="reason"
          :value="reason"
        >
          {{ t(`report_dialog.reasons.${reason}`) }}
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
