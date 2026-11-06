<script setup>
import { ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import CommentFields from '@/views/comments/CommentFields.vue'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { validateCommentForm } from '@/apis/comments/formRequest/comment-form-request.js'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  parentComment: { type: Object, required: true },
  mentionedAuthor: { type: Object, required: true },
})

const emit = defineEmits(['sent', 'cancel'])

const { commentStore } = useCommentStore()

const datas = ref({
  content: `@${props.mentionedAuthor.username} `,
  isSpoiler: false,
})
const sendButton = ref()

const publish = async () => {
  const validation = validateCommentForm(datas.value, 'reply')
  if (!validation.valid) {
    return
  }

  const response = await CommentController.createReply(
    props.parentComment,
    datas.value,
    props.mentionedAuthor,
  )
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  commentStore.addReply(response.comment)
  commentStore.setCommentCount(response.commentCount)
  emit('sent')
}
</script>

<template>
  <form
    class="comment-reply-form"
    @submit.prevent="sendButton?.runCallback()"
  >
    <CommentFields
      v-model="datas"
      formName="reply"
    >
      <div class="d-flex g-10">
        <button
          type="button"
          class="comment-reply-form__cancel | btn btn-sm btn-primary-alt"
          @click="emit('cancel')"
        >
          {{ t('comment_reply_form.cancel') }}
        </button>
        <LoaderComponent
          ref="sendButton"
          :cb="publish"
          buttonType="submit"
          buttonClasses="comment-reply-form__send | btn btn-sm btn-primary"
        >
          {{ t('comment_reply_form.send') }}
        </LoaderComponent>
      </div>
    </CommentFields>
  </form>
</template>
