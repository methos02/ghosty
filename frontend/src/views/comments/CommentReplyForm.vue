<script setup>
import { ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import CommentFields from '@/views/comments/CommentFields.vue'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { validateCommentForm } from '@/apis/comments/formRequest/comment-form-request.js'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  parentComment: { type: Object, required: true },
  mentionedAuthor: { type: Object, required: true },
})

const emit = defineEmits(['sent', 'cancel'])

const { commentStore } = useCommentStore()

const formDatas = ref({
  isSpoiler: false,
  mentionedUser: props.mentionedAuthor.isDeleted ? undefined : props.mentionedAuthor,
})
const sendButton = ref()

const publish = async () => {
  const validation = validateCommentForm(formDatas.value, 'reply')
  if (!validation.valid) {
    return
  }

  const response = await CommentController.createReply(props.parentComment, formDatas.value)
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
    <p
      v-if="formDatas.mentionedUser"
      class="comment-reply-form__mention | d-flex a-center g-5 mb-5"
    >
      <span class="badge d-flex a-center g-5">
        @{{ formDatas.mentionedUser.username }}
        <button
          type="button"
          class="comment-reply-form__mention-remove | pointer"
          :aria-label="t('comment_reply_form.remove_mention')"
          :title="t('comment_reply_form.remove_mention')"
          @click="formDatas.mentionedUser = undefined"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    </p>

    <CommentFields
      v-model="formDatas"
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

<style lang="scss" scoped>
.comment-reply-form__mention-remove {
  border: none;
  background: transparent;
  color: inherit;
}
</style>
