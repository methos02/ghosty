<script setup>
import { ref, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import { useChapterSummary } from '@/apis/chapters/composables/use-chapter-summary.js'

const { summarisedChapter, closeChapterSummary } = useChapterSummary()

const dialog = ref()

watch(
  () => summarisedChapter.value,
  chapter => {
    dialog.value?.toggle(chapter !== undefined)
  },
)
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="t('chapter_summary.title', { chapter: summarisedChapter?.title ?? '' })"
    @dialog-close="closeChapterSummary"
  >
    <p class="chapter-summary-dialog__text">
      {{ summarisedChapter?.summary }}
    </p>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.chapter-summary-dialog {
  &__text {
    max-width: 600px;
    line-height: 1.6;
  }
}
</style>
