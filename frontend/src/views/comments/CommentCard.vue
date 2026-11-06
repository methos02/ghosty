<script setup>
import { computed, ref } from 'vue'
import CommentContent from '@/views/comments/CommentContent.vue'
import CommentReplyForm from '@/views/comments/CommentReplyForm.vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const props = defineProps({
  comment: { type: Object, required: true },
})

const authStore = useAuthStore()
const { openLoginDialog } = useAuth()

const mentionedAuthor = ref()

const threadUsernames = computed(() =>
  [props.comment, ...props.comment.replies]
    .filter(threadComment => threadComment.author !== undefined)
    .map(threadComment => threadComment.author.username),
)

const openReplyForm = author => {
  if (!authStore.isAuthenticated.value) {
    openLoginDialog()
    return
  }

  mentionedAuthor.value = author
}

const closeReplyForm = () => {
  mentionedAuthor.value = undefined
}
</script>

<template>
  <div class="comment-card | d-flex f-column g-10 bg-neutral-200 radius-10 p-15">
    <CommentContent
      :comment="comment"
      :threadUsernames="threadUsernames"
      :isReplyable="!comment.isDeleted"
      @reply="openReplyForm(comment.author)"
    />

    <ul
      v-if="comment.replies.length > 0"
      class="comment-card__replies | d-flex f-column g-10"
    >
      <li
        v-for="reply in comment.replies"
        :key="reply.id"
        class="comment-card__reply"
      >
        <CommentContent
          :comment="reply"
          :threadUsernames="threadUsernames"
          :isReplyable="!comment.isDeleted"
          @reply="openReplyForm(reply.author)"
        />
      </li>
    </ul>

    <CommentReplyForm
      v-if="mentionedAuthor !== undefined"
      :key="mentionedAuthor.id"
      :parentComment="comment"
      :mentionedAuthor="mentionedAuthor"
      class="comment-card__reply-form"
      @sent="closeReplyForm"
      @cancel="closeReplyForm"
    />
  </div>
</template>

<style lang="scss" scoped>
.comment-card__replies,
.comment-card__reply-form {
  margin-left: 15px;
  padding-left: 15px;
  border-left: 2px solid var(--neutral-300);
}
</style>
