<script setup>
import { computed, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { COVER_LIKE_GUARD_STATUSES } from '@/constants/cover-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const props = defineProps({
  cover: { type: Object, required: true },
})

const authStore = useAuthStore()
const { openLoginDialog } = useAuth()
const { coverStore } = useCoverStore()

const likePending = ref(false)

const isOwnCover = computed(() => props.cover.author.id === authStore.user.value?.id)

const labelKey = computed(() => {
  if (isOwnCover.value) {
    return 'cover_like_button.own_cover'
  }

  return props.cover.isLiked ? 'cover_like_button.withdraw' : 'cover_like_button.support'
})

const sendLike = async () => {
  if (props.cover.isLiked) {
    return await CoverController.unlike(props.cover.id)
  }

  return await CoverController.like(props.cover.id)
}

const flashRefusal = response => {
  if (!COVER_LIKE_GUARD_STATUSES.includes(response.status)) {
    return
  }

  flash.error(response.data.message)
}

const toggle = async () => {
  if (likePending.value) {
    return
  }

  if (!authStore.isAuthenticated.value) {
    openLoginDialog()
    return
  }

  likePending.value = true
  const response = await sendLike()
  likePending.value = false

  if (!ajaxHelper.isSuccess(response.status)) {
    flashRefusal(response)
    return
  }

  coverStore.replaceCovers(response.like.covers)
  coverStore.setOfficialCoverId(response.like.officialCoverId)
}
</script>

<template>
  <button
    type="button"
    class="cover-like-button | btn btn-sm d-flex a-center g-5"
    :class="{
      'btn-primary': cover.isLiked,
      'btn-primary-alt': !cover.isLiked,
    }"
    :disabled="isOwnCover"
    :title="t(labelKey)"
    :aria-label="t(labelKey)"
    :aria-pressed="cover.isLiked"
    @click="toggle"
  >
    <i
      class="fa-heart"
      :class="cover.isLiked ? 'fa-solid' : 'fa-regular'"
    ></i>
    <span class="cover-like-button__count">{{ cover.likeCount }}</span>
  </button>
</template>
