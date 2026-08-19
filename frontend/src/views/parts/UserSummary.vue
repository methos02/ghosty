<script setup>
import { computed, onMounted, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const authStore = useAuthStore()

const PENDING_NOTIFICATIONS = 2

const draftsCount = ref(0)

const user = authStore.user

const hasDrafts = computed(() => draftsCount.value > 0)

const draftsRoute = computed(() =>
  hasDrafts.value ? { name: 'drafts' } : { name: 'novel-create' },
)

const loadDrafts = async () => {
  const response = await ChapterController.drafts()
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  draftsCount.value = response.chapters.length
}

onMounted(loadDrafts)
</script>

<template>
  <div class="user-summary | d-flex a-center g-20">
    <img
      v-if="user?.avatar"
      :src="user?.avatar"
      :alt="user?.username"
      class="user-summary__avatar"
    />
    <div
      v-if="!user?.avatar"
      class="user-summary__avatar | user-summary__avatar--empty d-flex a-center j-center color-neutral-100"
    >
      <i class="fa-solid fa-user"></i>
    </div>

    <div class="d-flex f-column g-5">
      <span class="user-summary__username | color-neutral-100 fs-700 fw-400">
        {{ user?.username }}
      </span>

      <router-link
        :to="draftsRoute"
        class="user-summary__drafts | color-neutral-100 fs-400"
      >
        {{ t('user_summary.drafts', draftsCount) }}
      </router-link>

      <span class="user-summary__notifications | color-neutral-100 fs-400">
        {{ t('user_summary.notifications', PENDING_NOTIFICATIONS) }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-summary {
  &__avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--neutral-100);

    &--empty {
      background-color: rgba(0, 0, 0, 0.45);
      font-size: 36px;
    }
  }

  &__drafts {
    text-decoration: underline;
  }
}
</style>
