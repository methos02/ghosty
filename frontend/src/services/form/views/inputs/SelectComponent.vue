<script setup>
import { computed } from 'vue'
import ErrorForm from '@/services/form/views/ErrorFormComponent.vue'
import { FormHelper } from '@/core/helpers/form-helper.js'
import { formStore } from '@/services/form/src/form-store.js'
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: Boolean, default: true },
  form: { type: String, default: undefined },
  containerClass: { type: String, default: '' },
  fixedLabel: { type: Boolean, default: false },
  noLabel: { type: Boolean, default: false },
})

const select = defineModel({ type: [Number, String, Object], default: undefined })

const isInvalid = computed(() =>
  formStore.hasError(FormHelper.getInputName(props.name, props.form)),
)
</script>

<template>
  <div
    class="select-container | p-relative"
    :class="props.containerClass"
  >
    <select
      :id="FormHelper.getInputName(name, form)"
      :name="FormHelper.getInputName(name, form)"
      class="form-input input"
      :class="{
        valid: select !== undefined || props.fixedLabel,
        'no-label': noLabel || label === '',
        invalide: isInvalid,
      }"
      v-model="select"
    >
      <option
        value=""
        disabled
        hidden
      ></option>
      <slot></slot>
    </select>
    <label
      v-if="label !== '' && !noLabel"
      class="form-label"
      :class="{ required: props.required }"
      :for="FormHelper.getInputName(name, form)"
    >
      {{ label }}
    </label>
    <ErrorForm
      v-if="error !== false"
      :name="FormHelper.getInputName(name, form)"
    />
  </div>
</template>
