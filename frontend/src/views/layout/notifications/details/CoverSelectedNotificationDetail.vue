<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  notification: { type: Object, required: true },
})
</script>

<template>
  <div class="cover-selected-notification-detail | d-flex a-center g-15">
    <img
      :src="notification.cover.imageUrl"
      :alt="t('cover_selected_notification_detail.image_alt', { title: notification.novel.title })"
      class="cover-selected-notification-detail__image | radius-5"
    />
    <p>{{ t('cover_selected_notification_detail.explanation') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.cover-selected-notification-detail__image {
  width: 60px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
</style>
