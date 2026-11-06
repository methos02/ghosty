<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import CommentCard from '@/views/comments/CommentCard.vue'
import CommentForm from '@/views/comments/CommentForm.vue'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  target: { type: Object, required: true },
})

const { comments, pagination, commentStore } = useCommentStore()

const state = { isUnmounted: false }
const isLoaded = ref(false)

const load = async (page = 1) => {
  const response = await CommentController.list(props.target, page)
  if (state.isUnmounted || !ajaxHelper.isSuccess(response.status)) {
    return
  }

  commentStore.addComments(response.comments)
  commentStore.setPagination(response.pagination)
  isLoaded.value = true
}

onMounted(() => load())

onUnmounted(() => {
  state.isUnmounted = true
  commentStore.clear()
})
</script>

<template>
  <section
    id="comments"
    class="comment-thread | d-flex f-column g-15"
  >
    <h2 class="comment-thread__title | fs-600 fw-700">
      {{ t('comment_thread.title') }}
    </h2>

    <CommentForm :target="target" />

    <p
      v-if="isLoaded && comments.length === 0"
      class="comment-thread__empty | text-center color-neutral-700 py-20"
    >
      {{ t('comment_thread.empty') }}
    </p>

    <ul class="comment-thread__items | d-flex f-column g-15">
      <li
        v-for="comment in comments"
        :key="comment.id"
      >
        <CommentCard :comment="comment" />
      </li>
    </ul>

    <div
      v-if="isLoaded && commentStore.hasMore()"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="comment-thread__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>
