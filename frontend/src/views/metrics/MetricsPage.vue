<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import MetricCard from '@/views/metrics/parts/MetricCard.vue'
import MetricCardSkeleton from '@/views/metrics/parts/MetricCardSkeleton.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { MetricsController } from '@/apis/metrics/controllers/metrics-controller.js'
import {
  METRICS_DEFAULT_PERIOD,
  METRICS_PERIODS,
  METRICS_KEYS,
} from '@/constants/metrics-constants.js'
import { useMetricsHead } from '@/head/use-metrics-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

useMetricsHead()

const days = ref(METRICS_DEFAULT_PERIOD)
const report = ref()
const isLoading = ref(true)

const range = computed(() => {
  const today = dateHelper.currentDate('YYYY-MM-DD')

  return {
    from: dateHelper.subtractFromDate(today, days.value, 'day', 'DD/MM/YYYY'),
    to: dateHelper.formatDate(today),
  }
})

const load = async () => {
  isLoading.value = true
  const response = await MetricsController.show(days.value)
  isLoading.value = false

  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  report.value = response.report
}

watch(days, load)

onMounted(load)
</script>

<template>
  <div class="metrics-page | f-column">
    <Header />

    <div class="metrics-page__body | w-xl py-40 px-20 d-flex f-column g-20">
      <h1 class="fs-700 fw-700">{{ t('metrics_page.title') }}</h1>

      <p class="metrics-page__intro | fs-300 color-neutral-700">
        {{ t('metrics_page.intro') }}
      </p>

      <div class="metrics-page__periods | d-flex f-wrap g-10">
        <button
          v-for="period in Object.values(METRICS_PERIODS)"
          :key="period"
          type="button"
          @click="days = period"
          class="metrics-page__period | btn"
          :class="{ 'btn-primary': days === period, 'btn-primary-alt': days !== period }"
        >
          {{ t('metrics_page.period', { days: period }) }}
        </button>
      </div>

      <p class="metrics-page__range | fs-300 color-neutral-700">
        {{ t('metrics_page.range', range) }}
      </p>

      <ul
        v-if="isLoading"
        class="metrics-page__grid"
      >
        <li
          v-for="metricKey in METRICS_KEYS"
          :key="metricKey"
          class="d-flex"
        >
          <MetricCardSkeleton :metricKey="metricKey" />
        </li>
      </ul>

      <template v-else-if="report">
        <ul class="metrics-page__grid">
          <li
            v-for="metric in report.metrics"
            :key="metric.key"
            class="d-flex"
          >
            <MetricCard
              :metric="metric"
              :inactiveAfterDays="report.inactiveAfterDays"
            />
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.metrics-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-auto-rows: 1fr;
    gap: 15px;
  }
}
</style>
