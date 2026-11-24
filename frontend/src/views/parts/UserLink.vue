<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  user: { type: Object, required: true },
  byline: { type: Boolean, default: false },
})
</script>

<template>
  <Translate
    v-if="byline"
    keypath="common.by_author"
  >
    <template #author>
      <span
        v-if="user.isDeleted"
        class="user-link user-link--deleted"
      >
        {{ t('common.deleted_account') }}
      </span>
      <router-link
        v-else
        :to="{ name: 'profile', params: { profileSlug: user.profileSlug } }"
        class="user-link | link-inline"
      >
        {{ user.username }}
      </router-link>
    </template>
  </Translate>

  <span
    v-else-if="user.isDeleted"
    class="user-link user-link--deleted"
  >
    {{ t('common.deleted_account') }}
  </span>

  <router-link
    v-else
    :to="{ name: 'profile', params: { profileSlug: user.profileSlug } }"
    class="user-link | link-inline"
  >
    {{ user.username }}
  </router-link>
</template>
