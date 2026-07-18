<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  delay: { type: Number, default: 200 },
})

const visible = ref(false)
const state = {
  timerId: undefined,
}

watch(
  () => props.loading,
  isLoading => {
    if (isLoading) {
      state.timerId = setTimeout(() => {
        visible.value = true
      }, props.delay)
      return
    }

    clearTimeout(state.timerId)
    visible.value = false
  },
  { immediate: true },
)

onUnmounted(() => {
  clearTimeout(state.timerId)
})
</script>

<template>
  <div
    v-if="visible"
    class="delayed-loader | f-column a-center j-center g-15 py-25"
  >
    <slot>
      <i class="fa-solid fa-spinner fa-spin fs-600"></i>
    </slot>
  </div>
</template>
