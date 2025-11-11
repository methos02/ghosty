<script setup>
import { ref } from 'vue'
import { t } from '@/services/services-helper.js'

const props = defineProps({
  title : { type: String, default : ''},
  closeCross : { type: Boolean, default : true },
  closeBg : { type: Boolean, default : true },
  noPadding : { type: Boolean, default : false },
})

const emit = defineEmits(['dialog-show', 'dialog-close'])

const dialog = ref()

const showDialog = () => {
  if (!dialog.value) { return }

  dialog.value.showModal()
  emit('dialog-show')
}

const closeDialog = () => {
  if (!dialog.value) { return }
  
  dialog.value.close()
  emit('dialog-close')
}

const toggleDialog = state => {
  if (!dialog.value) { return }
  
  if(state !== undefined) { 
    state === true ? showDialog() : closeDialog()
    return 
  }

  dialog.value.open ? closeDialog() : showDialog()
} 

defineExpose({ show: showDialog, close: closeDialog, toggle: toggleDialog })

const closeFromBackground = event => {
  if (event.currentTarget === event.target && props.closeBg === true) { closeDialog() }
}
</script>
<template>
  <dialog
    ref="dialog"
    class="dialog | bg-neutral-100 radius-5"
    @click="closeFromBackground"
  >
    <div class="dialog-header | d-flex g-25 color-neutral-100 bg-primary">
      <h2
        v-if="title !== ''"
        class="fs-700 fw-400"
      >
        {{ title }}
      </h2>
      <div
        v-if="closeCross === true"
        class="d-flex j-end flex-1"
      >
        <button
          class="dialog-close"
          type="button"
          :title="t('dialog.close')"
          data-dialog="close"
          @click="closeDialog()"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <div :class="['dialog-content', { 'p-15': !noPadding }]">
      <slot></slot>
    </div>
  </dialog>
</template>
<style lang="scss">

.dialog {
  overflow: visible;

  &-header {
    padding: 10px 15px;
    border-radius: 5px 5px 0 0;
  }
  
  &-close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    cursor: pointer;

    &:hover i {
      color: var(--neutral-400);
    }

    i {
      font-size: 1.4rem;
      color: var(--neutral-100);
      transition: color 300ms linear;
    }
  }
}

.dialog::backdrop {
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
}
</style>
