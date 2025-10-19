<script setup>
import { formStore } from "@/services/form/src/form-store.js"
import { t } from '@/services/services-helper.js'
import { computed } from "vue"

const props = defineProps({
  name: { type: String, required: true },
  error: { type: String, default: undefined }
})

const error = computed(() => {
  return props.error ?? formStore.getError(props.name) 
})
</script>

<template>
  <p 
    v-if="error !== undefined" 
    :id="`error-${name}`"
    class="form-error"
  >
    {{ t(error) }}
  </p>
</template>
