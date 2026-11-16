<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  metric: { type: Object, required: true },
  inactiveAfterDays: { type: Number, required: true },
})
</script>

<template>
  <article class="metric-card | flex-1 d-flex f-column g-5 bg-neutral-200 radius-10 p-15">
    <h2 class="metric-card__label | fs-400 fw-700">
      {{ t(`metric_card.metrics.${metric.key}.label`) }}
    </h2>

    <p class="d-flex a-end f-wrap g-10">
      <span class="metric-card__count | fs-700 fw-700">{{ metric.count }}</span>
      <span
        v-if="metric.total !== undefined"
        class="metric-card__total | fs-300 color-neutral-700"
      >
        {{ t('metric_card.out_of', { total: metric.total }) }}
      </span>
      <span
        v-if="metric.rate !== undefined"
        class="metric-card__rate | badge"
      >
        {{ t('metric_card.rate', { rate: metric.rate }) }}
      </span>
    </p>

    <p class="metric-card__description | fs-300 color-neutral-700">
      {{ t(`metric_card.metrics.${metric.key}.description`, { days: inactiveAfterDays }) }}
    </p>
  </article>
</template>
