<script setup>
import { ref } from 'vue'
import { t } from '@brugmann/vuemann/src/shortcuts/services-shortcut'

const props = defineProps({
  title: { type: String, default: '' },
  closeCross: { type: Boolean, default: true },
  closeBg: { type: Boolean, default: false },
})

const emit = defineEmits(['dialog-show', 'dialog-close'])

const dialog = ref()
const isOpen = ref(false)

const showDialog = () => {
  if (!dialog.value || dialog.value.open) {
    return
  }

  dialog.value.showModal()
  isOpen.value = true
  emit('dialog-show')
}

const closeDialog = () => {
  if (!dialog.value?.open) {
    return
  }

  dialog.value.close()
  isOpen.value = false
  emit('dialog-close')
}

const closeSilent = () => {
  if (!dialog.value?.open) {
    return
  }

  dialog.value.close()
  isOpen.value = false
}

const toggleDialog = state => {
  if (!dialog.value) {
    return
  }

  if (state !== undefined) {
    if (state === true) {
      showDialog()
    }
    if (state === false) {
      closeDialog()
    }
    return
  }

  if (dialog.value.open) {
    closeDialog()
  }
  if (!dialog.value.open) {
    showDialog()
  }
}

defineExpose({
  show: showDialog,
  close: closeDialog,
  closeSilent,
  toggle: toggleDialog,
  isOpen,
})

const closeFromBackground = event => {
  if (event.currentTarget === event.target && props.closeBg === true) {
    closeDialog()
  }
}
</script>
<template>
  <dialog
    ref="dialog"
    class="dialog | bg-neutral-100 p-15 radius-5"
    @click="closeFromBackground"
    @cancel.prevent="closeDialog()"
  >
    <button
      v-if="closeCross === true"
      class="dialog-close"
      type="button"
      :title="t('dialog.close')"
      data-dialog="close"
      @click="closeDialog()"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
    <h2
      v-if="title !== ''"
      class="fs-700 fw-400 color-primary"
    >
      {{ title }}
    </h2>
    <slot></slot>
  </dialog>
</template>
<style lang="scss">
.dialog {
  overflow: visible;

  &-close {
    position: absolute;
    top: -30px;
    right: -30px;
    background-color: transparent;
    color: var(--neutral-100);
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: var(--neutral-500);
      background-color: transparent;
    }

    i {
      font-size: 1.5rem;
    }
  }
}

.dialog::backdrop {
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
}

@media print {
  dialog:not([open]) {
    display: none !important;
  }

  dialog[open] {
    position: static;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 15px;
    border: none;
    box-shadow: none;
  }

  dialog::backdrop {
    display: none;
  }

  .dialog-close {
    display: none;
  }

  :has(dialog[open]) > *:not(:has(dialog[open])):not(dialog[open]) {
    display: none !important;
  }
}
</style>
