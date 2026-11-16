<script setup>
import SkeletonLoader from '@/components/SkeletonLoaderComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { METRICS_SKELETON_VALUE } from '@/constants/metrics-constants.js'

defineProps({
  metricKey: { type: String, required: true },
})
</script>

<template>
  <article
    class="metric-card-skeleton | flex-1 d-flex f-column g-5 bg-neutral-200 radius-10 p-15"
    aria-hidden="true"
  >
    <h2 class="fs-400 fw-700">
      <SkeletonLoader>{{ t(`metric_card.metrics.${metricKey}.label`) }}</SkeletonLoader>
    </h2>

    <p class="d-flex a-end f-wrap g-10">
      <SkeletonLoader class="fs-700 fw-700">{{ METRICS_SKELETON_VALUE }}</SkeletonLoader>
      <SkeletonLoader class="badge">
        {{ t('metric_card.rate', { rate: METRICS_SKELETON_VALUE }) }}
      </SkeletonLoader>
    </p>

    <p class="fs-300">
      <SkeletonLoader>{{ t(`metric_card.metrics.${metricKey}.description`) }}</SkeletonLoader>
    </p>
  </article>
</template>
