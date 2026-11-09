<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  reports: { type: Array, required: true },
})
</script>

<template>
  <section class="moderation-report-list | d-flex f-column g-10">
    <h2 class="fs-500 fw-700">{{ t('moderation_report_list.title', reports.length) }}</h2>

    <ul class="d-flex f-column g-10">
      <li
        v-for="report in reports"
        :key="report.id"
        class="moderation-report-list__report | d-flex f-column g-5 bg-neutral-200 p-15 radius-10"
      >
        <div class="d-flex j-between g-10 f-wrap">
          <span class="moderation-report-list__reason | fw-700">
            {{ t(`common.report_reasons.${report.reason}`) }}
          </span>
          <span
            v-if="report.isPending"
            class="moderation-report-list__status | fs-300 color-warning"
          >
            {{ t('moderation_report_list.pending') }}
          </span>
          <span
            v-else
            class="moderation-report-list__status | fs-300 color-neutral-700"
          >
            {{ t(`moderation.resolutions.${report.resolution}`) }}
          </span>
        </div>

        <p
          v-if="report.description !== ''"
          class="moderation-report-list__description"
        >
          {{ report.description }}
        </p>

        <span class="moderation-report-list__reporter | fs-300 color-neutral-700">
          {{
            t('moderation_report_list.reported_by', {
              reporter: report.reporter.username,
              date: report.createdAtFormat,
            })
          }}
        </span>
      </li>
    </ul>
  </section>
</template>
