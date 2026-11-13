<script setup>
import { computed, ref, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import CommentThread from '@/views/comments/CommentThread.vue'
import { useCoverComments } from '@/core-vue/composables/comments/use-cover-comments.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'

const { commentedCover, coverComments } = useCoverComments()
const { commentCount } = useCommentStore()
const { coverStore } = useCoverStore()

const dialog = ref()

const commentTarget = computed(() => ({
  type: COMMENT_TARGETS.COVER,
  coverId: commentedCover.value.id,
}))

watch(commentCount, count => {
  if (count === undefined || commentedCover.value === undefined) {
    return
  }

  coverStore.setCommentCount(commentedCover.value.id, count)
})

watch(
  () => commentedCover.value,
  cover => {
    dialog.value?.toggle(cover !== undefined)
  },
)
</script>

<template>
  <DialogComponent
    ref="dialog"
    @dialog-close="coverComments.close"
  >
    <template #title>
      <template v-if="commentedCover !== undefined">
        {{ t('cover_comments_dialog.title', { author: commentedCover.author.username }) }}
      </template>
    </template>

    <div class="cover-comments-dialog">
      <CommentThread
        v-if="commentedCover"
        :key="commentedCover.id"
        :target="commentTarget"
      />
    </div>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.cover-comments-dialog {
  width: 100vw;
  max-width: 700px;
  max-height: calc(100dvh - 150px);
  overflow-y: auto;
  padding-right: 10px;
}
</style>
