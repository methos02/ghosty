<script setup>
import { ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import CommentFields from '@/views/comments/CommentFields.vue'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { validateCommentForm } from '@/apis/comments/formRequest/comment-form-request.js'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const props = defineProps({
  target: { type: Object, required: true },
})

const authStore = useAuthStore()
const { openLoginDialog } = useAuth()
const { commentStore } = useCommentStore()

const datas = ref({
  content: '',
  isSpoiler: false,
})
const sendButton = ref()

const publish = async () => {
  const validation = validateCommentForm(datas.value, 'comment')
  if (!validation.valid) {
    return
  }

  const response = await CommentController.create(props.target, datas.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  commentStore.addComment(response.comment)
  commentStore.setCommentCount(response.commentCount)
  datas.value = {
    content: '',
    isSpoiler: false,
  }
}
</script>

<template>
  <div class="comment-form">
    <form
      v-if="authStore.isAuthenticated.value"
      class="comment-form__fields"
      @submit.prevent="sendButton?.runCallback()"
    >
      <CommentFields
        v-model="datas"
        formName="comment"
      >
        <LoaderComponent
          ref="sendButton"
          :cb="publish"
          buttonType="submit"
          buttonClasses="comment-form__send | btn btn-primary"
        >
          {{ t('comment_form.send') }}
        </LoaderComponent>
      </CommentFields>
    </form>

    <div
      v-else
      class="d-flex j-center"
    >
      <button
        type="button"
        class="comment-form__login | btn btn-primary-alt"
        @click="openLoginDialog()"
      >
        {{ t('comment_form.login') }}
      </button>
    </div>
  </div>
</template>
