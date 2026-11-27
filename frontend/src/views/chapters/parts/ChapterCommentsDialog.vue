<script setup>
import { computed, ref, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import CommentThread from '@/views/comments/CommentThread.vue'
import { useChapterComments } from '@/core-vue/composables/comments/use-chapter-comments.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { useReadingStore } from '@/core-vue/stores/chapters/reading-store.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'

const { commentedChapter, closeChapterComments } = useChapterComments()
const { commentCount } = useCommentStore()
const { setChapterCommentCount } = useReadingStore()

const dialog = ref()

const commentTarget = computed(() => ({
  type: COMMENT_TARGETS.CHAPTER,
  chapterId: commentedChapter.value.id,
}))

watch(commentCount, count => {
  if (count === undefined || commentedChapter.value === undefined) {
    return
  }

  setChapterCommentCount(commentedChapter.value.id, count)
})

watch(
  () => commentedChapter.value,
  chapter => {
    dialog.value?.toggle(chapter !== undefined)
  },
)
</script>

<template>
  <DialogComponent
    ref="dialog"
    :fullscreenOnPhone="true"
    :title="t('chapter_comments_dialog.title', { chapter: commentedChapter?.title ?? '' })"
    @dialog-close="closeChapterComments"
  >
    <div class="chapter-comments-dialog">
      <CommentThread
        v-if="commentedChapter"
        :key="commentedChapter.id"
        :target="commentTarget"
        :showTitle="false"
      />
    </div>
  </DialogComponent>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.chapter-comments-dialog {
  width: calc(100vw - 50px);
  max-width: 700px;
  max-height: calc(100dvh - 150px);
  overflow-y: auto;
  padding-right: 10px;

  @media (max-width: variables.$sm) {
    width: 100%;
    max-width: none;
    max-height: calc(100dvh - 85px);
    padding-right: 0;
  }
}
</style>
