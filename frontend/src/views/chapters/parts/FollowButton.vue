<script setup>
import { computed } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { FollowController } from '@/apis/follows/controllers/follow-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'

const authStore = useAuthStore()
const { openLoginDialog } = useAuth()
const { chapter, setChapterFollow } = useReadingStore()

const isFollowed = computed(() => chapter.value?.isFollowed === true)

const label = computed(() =>
  isFollowed.value ? t('follow_button.unfollow') : t('follow_button.follow'),
)

const buttonClasses = computed(() =>
  isFollowed.value
    ? 'follow-button | btn btn-icon btn-sm btn-primary'
    : 'follow-button | btn btn-icon btn-sm btn-primary-alt',
)

const sendFollow = async chapterId => {
  if (isFollowed.value) {
    return await FollowController.unfollow(chapterId)
  }

  return await FollowController.follow(chapterId)
}

const flashOutcome = isNowFollowed => {
  if (isNowFollowed) {
    flash.successT('follow_button.followed')
    return
  }

  flash.successT('follow_button.unfollowed')
}

const toggleFollow = async () => {
  if (!authStore.isAuthenticated.value) {
    openLoginDialog()
    return
  }

  const chapterId = chapter.value.id
  const response = await sendFollow(chapterId)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  setChapterFollow(chapterId, response.isFollowed)
  flashOutcome(response.isFollowed)
}
</script>

<template>
  <LoaderComponent
    :cb="toggleFollow"
    :buttonClasses="buttonClasses"
    :title="label"
    :aria-label="label"
    :aria-pressed="isFollowed"
  >
    <i
      class="fa-bookmark"
      :class="isFollowed ? 'fa-solid' : 'fa-regular'"
    ></i>
  </LoaderComponent>
</template>

<style lang="scss" scoped>
.follow-button.btn-primary {
  border: 1px solid transparent;

  i,
  &:hover i,
  &:focus i {
    color: var(--neutral-100);
  }
}
</style>
