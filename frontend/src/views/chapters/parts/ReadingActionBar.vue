<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import LikeButton from '@/views/chapters/parts/LikeButton.vue'
import FollowButton from '@/views/chapters/parts/FollowButton.vue'
import { useReadingStore } from '@/core-vue/stores/chapters/reading-store.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { useChapterComments } from '@/core-vue/composables/comments/use-chapter-comments.js'

const { chapter } = useReadingStore()
const { report } = useReport()
const { openChapterComments } = useChapterComments()
</script>

<template>
  <nav
    v-if="chapter"
    class="reading-action-bar | no-print a-center j-between g-10 px-20"
  >
    <LikeButton />

    <FollowButton v-if="!chapter.isDraft" />

    <button
      v-if="!chapter.isDraft"
      type="button"
      class="reading-action-bar__comments | btn btn-sm btn-primary-alt d-flex a-center g-5"
      :aria-label="t('reading_action_bar.comments')"
      @click="openChapterComments(chapter)"
    >
      <i class="fa-solid fa-comments"></i>
      <span>
        {{ chapter.commentCount }}
      </span>
    </button>

    <button
      v-if="report.canReport(chapter)"
      type="button"
      class="reading-action-bar__report | btn btn-icon btn-sm btn-primary-alt"
      :aria-label="t('chapter_read.report')"
      @click="report.openChapterReport(chapter)"
    >
      <i class="fa-solid fa-circle-exclamation"></i>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.reading-action-bar {
  display: none;

  @media (max-width: variables.$lg) {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 20;
    height: 60px;
    padding-inline: max(20px, calc((100% - 600px) / 2));
    border-top: 1px solid var(--neutral-400);
    background-color: var(--neutral-100);
  }
}

.reading-night .reading-action-bar {
  border-top-color: var(--night-700);
  background-color: var(--night-900);
}
</style>
