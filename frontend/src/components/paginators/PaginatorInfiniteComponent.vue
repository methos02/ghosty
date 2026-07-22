<script setup>
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { STATUS } from '@/constants/ajax-constants.js'

const props = defineProps({
  cb: { type: Function, required: true },
  params: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
})

const isLoading = ref(false)
const errorMessage = ref('')

const loadMore = async () => {
  if (isLoading.value || errorMessage.value || props.params.nextPage > props.params.lastPage) {
    return
  }

  isLoading.value = true
  const response = await props.cb()
  if (response?.status !== STATUS.SUCCESS) {
    errorMessage.value = response?.error || 'Une erreur est survenue'
  }
  isLoading.value = false
}

const DEFAULT_DISTANCE = 10

onMounted(() => {
  const target =
    props.options.observe === 'window' ? globalThis : document.querySelector(props.options.observe)
  const distance = props.options.distance || DEFAULT_DISTANCE
  useInfiniteScroll(target, loadMore, { distance })
})
</script>

<template>
  <div class="paginator-infinite_container">
    <div
      v-if="errorMessage"
      class="bg-danger-100 p-15 radius-10"
    >
      <span class="color-danger fs-500">{{ errorMessage }}</span>
    </div>
    <slot v-if="!errorMessage"></slot>
    <div
      v-if="isLoading"
      class="d-flex j-center p-30"
    >
      <span class="fs-500 color-neutral-700">Chargement...</span>
    </div>
  </div>
</template>

<style lang="scss">
.paginator-infinite {
  &_container {
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
