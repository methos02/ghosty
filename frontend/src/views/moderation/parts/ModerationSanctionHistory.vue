<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import { SANCTION_TYPES } from '@/constants/moderation-constants.js'

defineProps({
  sanctions: { type: Array, required: true },
})
</script>

<template>
  <section class="moderation-sanction-history | d-flex f-column g-10">
    <h2 class="fs-500 fw-700">{{ t('moderation_sanction_history.title') }}</h2>

    <p
      v-if="sanctions.length === 0"
      class="moderation-sanction-history__empty | color-neutral-700"
    >
      {{ t('moderation_sanction_history.empty') }}
    </p>

    <ul
      v-else
      class="d-flex f-column g-10"
    >
      <li
        v-for="sanction in sanctions"
        :key="sanction.id"
        class="moderation-sanction-history__sanction | d-flex f-column g-5 bg-neutral-200 p-15 radius-10"
      >
        <div class="d-flex j-between g-10 f-wrap">
          <span class="moderation-sanction-history__type | fw-700">
            {{ t(`moderation.sanction_types.${sanction.type}`) }}
          </span>
          <span class="fs-300 color-neutral-700">
            {{ t('moderation_sanction_history.given_on', { date: sanction.createdAtFormat }) }}
          </span>
        </div>

        <span
          v-if="sanction.type !== SANCTION_TYPES.WARNING && sanction.isPermanent"
          class="moderation-sanction-history__duration | fs-300"
        >
          {{ t('moderation_sanction_history.permanent') }}
        </span>
        <span
          v-else-if="sanction.type !== SANCTION_TYPES.WARNING"
          class="moderation-sanction-history__duration | fs-300"
        >
          {{ t('moderation_sanction_history.until', { date: sanction.untilFormat }) }}
        </span>

        <p
          v-if="sanction.reason !== ''"
          class="moderation-sanction-history__reason"
        >
          {{ sanction.reason }}
        </p>
      </li>
    </ul>
  </section>
</template>
