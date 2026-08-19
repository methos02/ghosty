<script setup>
import { ref } from 'vue'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'

const props = defineProps({
  cb: { type: Function, required: true },
  params: { type: Array, default: () => [] },
  question: { type: String, required: true },
  buttonClasses: { type: String, default: 'btn btn-danger-alt' },
  disabled: { type: Boolean, default: false },
})

const dialog = ref()

const ask = () => {
  dialog.value?.show()
}

const cancel = () => {
  dialog.value?.close()
}

const confirm = async () => {
  await props.cb(...props.params)
  dialog.value?.close()
}
</script>

<template>
  <button
    type="button"
    @click="ask"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot></slot>
  </button>

  <DialogComponent
    ref="dialog"
    :closeBg="false"
    :closeCross="false"
  >
    <div class="confirm-button__body | d-flex f-column g-25">
      <p class="confirm-button__question">{{ question }}</p>

      <div class="d-flex j-center g-20">
        <LoaderComponent
          :cb="confirm"
          buttonClasses="confirm-button__valid | btn btn-danger"
        >
          {{ t('confirm_button.valid') }}
        </LoaderComponent>
        <button
          type="button"
          @click="cancel"
          class="confirm-button__cancel | btn btn-primary-alt"
        >
          {{ t('confirm_button.cancel') }}
        </button>
      </div>
    </div>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.confirm-button {
  &__body {
    max-width: 42ch;
  }

  &__question {
    line-height: 1.5;
    white-space: pre-line;
  }
}
</style>
