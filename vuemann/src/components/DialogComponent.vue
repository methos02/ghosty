<script setup>
import { ref } from 'vue'
import { t } from "@brugmann/vuemann/src/services/services-helper";

const props = defineProps({
  title : { type: String, default : ''},
  closeCross : { type: Boolean, default : true },
  closeBg : { type: Boolean, default : true },
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
    class="dialog | bg-neutral-100 p-15 radius-5"
    @click="closeFromBackground"
  >
    <div class="d-flex g-25">
      <h2 
        v-if="title !== ''"
        class="fs-700 fw-400 color-primary"
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
    <slot></slot>
  </dialog>
</template>
<style lang="scss">

.dialog {
  overflow: visible;
  
  &-close {
    background-color: var(--neutral-100);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    cursor: pointer;
    transition: background-color 300ms linear;

    &:hover {
      background-color: var(--neutral-400);
    }

    i {
      font-size: 1.4rem;
    }
  }
}

.dialog::backdrop {
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
}
</style>
