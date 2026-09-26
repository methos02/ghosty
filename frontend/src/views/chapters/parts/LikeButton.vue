<script setup>
import { computed, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { LikeController } from '@/apis/likes/controllers/like-controller.js'
import { LIKE_GUARD_STATUSES } from '@/constants/like-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'

const authStore = useAuthStore()
const { openLoginDialog } = useAuth()
const { chapter, setChapterLike } = useReadingStore()

const likePending = ref(false)

const isLiked = computed(() => chapter.value?.isLiked === true)
const likeCount = computed(() => chapter.value?.likeCount ?? 0)
const isOwnChapter = computed(() => chapter.value?.author.id === authStore.user.value?.id)

const countStyle = computed(() => ({
  width: `${String(likeCount.value).length}ch`,
}))

const label = computed(() => {
  if (isOwnChapter.value) {
    return t('like_button.own_chapter')
  }

  return isLiked.value ? t('like_button.withdraw') : t('like_button.support')
})

const sendLike = async chapterId => {
  if (isLiked.value) {
    return await LikeController.unlike(chapterId)
  }

  return await LikeController.like(chapterId)
}

const flashRefusal = response => {
  if (!LIKE_GUARD_STATUSES.includes(response.status)) {
    return
  }

  flash.error(response.data.message)
}

const flashOutcome = isSupported => {
  if (isSupported) {
    flash.successT('like_button.supported')
    return
  }

  flash.successT('like_button.withdrawn')
}

const toggle = async () => {
  if (likePending.value) {
    return
  }

  if (!authStore.isAuthenticated.value) {
    openLoginDialog()
    return
  }

  const chapterId = chapter.value.id
  likePending.value = true
  const response = await sendLike(chapterId)
  likePending.value = false

  if (!ajaxHelper.isSuccess(response.status)) {
    flashRefusal(response)
    return
  }

  setChapterLike(chapterId, response.like)
  flashOutcome(response.like.isLiked)
}
</script>

<template>
  <button
    type="button"
    class="like-button | btn btn-sm d-flex a-center g-5"
    :class="{
      'btn-primary': isLiked,
      'btn-primary-alt': !isLiked,
    }"
    :disabled="likePending || isOwnChapter"
    :title="label"
    :aria-label="label"
    :aria-pressed="isLiked"
    :aria-busy="likePending"
    @click.stop="toggle"
  >
    <span class="like-button__mark">
      <span
        v-if="likePending"
        class="like-button__spinner"
      ></span>
      <i
        v-else
        class="fa-solid fa-heart"
      ></i>
    </span>

    <span
      class="like-button__count"
      :style="countStyle"
    >
      {{ likeCount }}
    </span>
  </button>
</template>

<style lang="scss" scoped>
.like-button {
  &.btn-primary {
    border: 1px solid transparent;
  }

  &:disabled {
    opacity: 1;
  }

  &__mark,
  &__count {
    flex: none;
    min-width: 0;
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25em;
    height: 1em;
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: like-button-spin 600ms linear infinite;
  }

  &__count {
    font-variant-numeric: tabular-nums;
    text-align: center;
  }
}

@keyframes like-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
