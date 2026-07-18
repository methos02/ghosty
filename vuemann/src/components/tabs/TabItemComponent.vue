<script setup>
import { inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  tabKey: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '' },
})

const tabs = inject('tabs')

onMounted(() => {
  tabs.register({
    key: props.tabKey,
    label: props.label,
    icon: props.icon,
  })
})

onUnmounted(() => {
  tabs.unregister(props.tabKey)
})

const isActive = () => tabs.activeKey.value === props.tabKey
</script>

<template>
  <div
    v-show="isActive()"
    role="tabpanel"
  >
    <slot></slot>
  </div>
</template>
