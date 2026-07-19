<script setup>
import { ref, computed } from 'vue'
import ErrorForm from '@/services/form/views/ErrorFormComponent.vue'
import { FormHelper } from '@/helpers/form-helper.js'
const props = defineProps({
  name: { type: String, required: true },
  placeholder: { type: String, default: undefined },
  label: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  autogrow: { type: Boolean, default: false },
  error: { type: Boolean, default: true },
  form: { type: String, default: undefined },
  maxLength: { type: Number, default: undefined },
  noLabel: { type: Boolean, default: false },
})

const value = defineModel({ type: String, default: '' })

const characterCount = computed(() => {
  return value.value.length || 0
})

const textarea = ref()

const autoGrow = () => {
  if (props.autogrow === false) {
    return
  }

  textarea.value.style.height = 'auto'
  textarea.value.style.height = textarea.value.scrollHeight + 'px'
}
</script>

<template>
  <div class="form-component">
    <div class="p-relative">
      <textarea
        :id="FormHelper.getInputName(name, form)"
        :name="FormHelper.getInputName(name, form)"
        :title="FormHelper.getInputName(name, form)"
        :placeholder="label !== undefined ? ' ' : placeholder"
        class="form-input input"
        :class="{
          autogrow: props.autogrow,
          'no-label': noLabel || label === undefined,
        }"
        ref="textarea"
        v-model="value"
        @input="autoGrow"
      >
      </textarea>
      <label
        v-if="label !== undefined && !noLabel"
        class="form-label"
        :class="{ required: props.required }"
        :for="FormHelper.getInputName(name, form)"
      >
        {{ label }}
      </label>
    </div>
    <div
      v-if="maxLength !== undefined"
      class="textarea-count | d-flex j-end"
    >
      <span
        :class="{ 'color-danger': characterCount > maxLength }"
        class="fs-300"
      >
        {{ characterCount }}/{{ maxLength }} caractères
      </span>
    </div>
    <ErrorForm
      v-if="error !== false"
      :name="FormHelper.getInputName(name, form)"
    />
  </div>
</template>
