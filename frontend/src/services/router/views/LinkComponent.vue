<script setup>
defineProps({
  to: { type: [String, Object], required: true },
})
</script>

<template>
  <router-link
    :to="to"
    v-bind="$attrs"
  >
    <slot></slot>
  </router-link>
</template>
