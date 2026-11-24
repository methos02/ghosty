<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  user: { type: Object, required: true },
})
</script>

<template>
  <span
    v-if="user.isDeleted"
    class="comment-mention comment-mention--deleted | fw-700 color-neutral-600"
  >
    @{{ t('common.deleted_account') }}
  </span>
  <router-link
    v-else
    :to="{ name: 'profile', params: { profileSlug: user.profileSlug } }"
    class="comment-mention | link-inline"
  >
    @{{ user.username }}
  </router-link>
</template>
