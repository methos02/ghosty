<script setup>
defineProps({
  keypath: { type: String, required: true },
  tag: { type: String, default: 'span' },
})
</script>

<template>
  <i18n-t
    :keypath="keypath"
    :tag="tag"
    scope="global"
  >
    <template
      v-for="slotName in Object.keys($slots)"
      :key="slotName"
      #[slotName]
    >
      <slot :name="slotName"></slot>
    </template>
  </i18n-t>
</template>
