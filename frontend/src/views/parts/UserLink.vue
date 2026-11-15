<script setup>
import Translate from '@/services/locale/views/TranslateComponent.vue'

defineProps({
  username: { type: String, required: true },
  byline: { type: Boolean, default: false },
})
</script>

<template>
  <Translate
    v-if="byline"
    keypath="common.by_author"
  >
    <template #author>
      <router-link
        :to="{ name: 'profile', params: { username } }"
        class="user-link | link-inline"
      >
        {{ username }}
      </router-link>
    </template>
  </Translate>

  <router-link
    v-else
    :to="{ name: 'profile', params: { username } }"
    class="user-link | link-inline"
  >
    {{ username }}
  </router-link>
</template>
