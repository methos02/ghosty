<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  statistics: { type: Object, required: true },
})
</script>

<template>
  <dl class="profile-statistics">
    <div
      class="profile-statistics__item | d-flex f-column a-center g-5 bg-neutral-200 radius-10 p-15"
    >
      <dt class="fs-300 color-neutral-700">{{ t('profile_statistics.reads') }}</dt>
      <dd class="profile-statistics__reads | fs-600 fw-700">{{ statistics.readCount }}</dd>
    </div>
    <div
      class="profile-statistics__item | d-flex f-column a-center g-5 bg-neutral-200 radius-10 p-15"
    >
      <dt class="fs-300 color-neutral-700">{{ t('profile_statistics.likes') }}</dt>
      <dd class="profile-statistics__likes | fs-600 fw-700">{{ statistics.likeCount }}</dd>
    </div>
    <div
      class="profile-statistics__item | d-flex f-column a-center g-5 bg-neutral-200 radius-10 p-15"
    >
      <dt class="fs-300 color-neutral-700">{{ t('profile_statistics.received_continuations') }}</dt>
      <dd class="profile-statistics__continuations | fs-600 fw-700">
        {{ statistics.receivedContinuationCount }}
      </dd>
    </div>
    <div
      class="profile-statistics__item | d-flex f-column a-center g-5 bg-neutral-200 radius-10 p-15"
    >
      <dt class="fs-300 color-neutral-700">{{ t('profile_statistics.contributions') }}</dt>
      <dd class="profile-statistics__contributions | fs-300 text-center">
        <span class="d-block">{{ t('profile_statistics.novels', statistics.novelCount) }}</span>
        <span class="d-block">{{ t('profile_statistics.chapters', statistics.chapterCount) }}</span>
        <span class="d-block">{{ t('profile_statistics.covers', statistics.coverCount) }}</span>
        <span
          v-if="statistics.officialCoverCount > 0"
          class="d-block"
        >
          {{ t('profile_statistics.official_covers', statistics.officialCoverCount) }}
        </span>
      </dd>
    </div>
  </dl>
</template>

<style lang="scss" scoped>
.profile-statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin: 0;

  dd {
    margin: 0;
  }
}
</style>
