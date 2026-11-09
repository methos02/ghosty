<script setup>
import { computed, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { mentionHelper } from '@/core/helpers/mention-helper.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'

const props = defineProps({
  comment: { type: Object, required: true },
  isReplyable: { type: Boolean, default: false },
  threadUsernames: { type: Array, default: () => [] },
})

const emit = defineEmits(['reply'])

const authStore = useAuthStore()
const { commentStore } = useCommentStore()
const { report } = useReport()

const isSpoilerRevealed = ref(false)

const isOwnComment = computed(() => props.comment.author.id === authStore.user.value?.id)

const contentParts = computed(() =>
  mentionHelper.split(props.comment.content, props.threadUsernames),
)

const isContentMasked = computed(() => props.comment.isSpoiler && !isSpoilerRevealed.value)

const deleteComment = async comment => {
  const response = await CommentController.destroy(comment)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  commentStore.removeComment(comment)
  commentStore.setCommentCount(response.commentCount)
  flash.successT('comment_content.deleted')
}
</script>

<template>
  <article class="comment-content | d-flex f-column g-5">
    <p
      v-if="comment.isDeleted"
      class="comment-content__deleted | fs-300 color-neutral-600"
    >
      {{ t('comment_content.deleted_comment') }}
    </p>

    <p
      v-else-if="comment.isHidden"
      class="comment-content__hidden | fs-300 color-neutral-600"
    >
      {{ t('comment_content.hidden_comment') }}
    </p>

    <template v-else>
      <header class="comment-content__header | d-flex a-center g-10">
        <span class="comment-content__author | fw-700">
          {{ comment.author.username }}
        </span>
        <span class="comment-content__date | fs-300 color-neutral-600">
          {{ comment.createdAtFormat }}
        </span>
      </header>

      <button
        v-if="isContentMasked"
        type="button"
        class="comment-content__spoiler | btn btn-sm btn-primary-alt"
        @click="isSpoilerRevealed = true"
      >
        {{ t('comment_content.reveal_spoiler') }}
      </button>

      <p
        v-else
        class="comment-content__text"
      >
        <span
          v-if="contentParts.mention"
          class="comment-content__mention | fw-700 color-primary"
        >
          {{ contentParts.mention }}
        </span>
        {{ contentParts.rest }}
      </p>

      <footer class="comment-content__actions | d-flex a-center g-10">
        <button
          v-if="isReplyable"
          type="button"
          class="comment-content__reply | btn btn-sm btn-primary-alt"
          @click="emit('reply')"
        >
          {{ t('comment_content.reply') }}
        </button>

        <ConfirmButtonComponent
          v-if="isOwnComment"
          :cb="deleteComment"
          :params="[comment]"
          :question="t('comment_content.delete_confirm')"
          buttonClasses="comment-content__delete | btn btn-sm btn-danger-alt"
        >
          {{ t('comment_content.delete') }}
        </ConfirmButtonComponent>

        <button
          v-if="!isOwnComment"
          type="button"
          class="comment-content__report | btn btn-sm btn-primary-alt"
          @click="report.openCommentReport(comment)"
        >
          {{ t('comment_content.report') }}
        </button>
      </footer>
    </template>
  </article>
</template>

<style lang="scss" scoped>
.comment-content__text {
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
