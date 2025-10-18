<script setup>
import {ref, onMounted} from "vue";
import DialogComponent from "@brugmann/vuemann/src/components/DialogComponent.vue";
import { flash, t } from "@brugmann/vuemann/src/services/services-helper.js";

const props = defineProps({
  icon : { type: String, default: ''},
  text : { type: String, default: ''},
  cb : { type: Function, required: true},
  params : { type: Array, default: []},
  question : { type: String, default: '' }
})

onMounted(() => {
  if(props.text !== '' && props.icon !== '') { flash.error('ConfirmIconComponent: text and icon cannot be used together'); }
})

const dialog = ref()
const state = ref('init')

const runCallBack = async () => {
  if(props.question !== '') { dialog.value.close() }
  
  state.value = 'loading'
  await props.cb(...props.params)
  state.value = 'init' 
}

const clickEvent = () => {
  state.value = 'confirm'
  
  if(props.question !== '') { dialog.value.show() }
}
</script>

<template>
  <div class="confirm-icon | f-center">
    <button
        v-if="state === 'init' || (state === 'confirm' && question !== '')"
        type="button"
        class="button-confirm | link-default pointer"
        data-confirm
        @click="clickEvent"
    >
      <i v-if="icon !== '' && text === ''" :class="icon"></i>
      <span 
        v-if="text !== '' && icon === ''"
        class="pointer underline-hover"
      >
        {{ text }}
      </span>
    </button>
    <div v-if="state === 'confirm' && question === ''" class="f-center g-5">
      <button
          type="button"
          class="confirm-icon_button | pointer"
          data-valid
          @click="runCallBack"
      >
        <i class="confirm-icon_icon | success fa-solid fa-check"></i>
      </button>
      <button
          type="button"
          data-cancel
          class="confirm-icon_button | pointer"
          @click="state = 'init'"
      >
        <i class="confirm-icon_icon | danger fa-solid fa-xmark"></i>
      </button>
    </div>
    <div v-if="state === 'loading'" class="row-center">
      <span class="loader-spin"></span>
    </div>
    <DialogComponent
      v-if="question !== ''"
      ref="dialog"
      :closeBg="false"
      :closeCross="false"
    >
      <p class="mb-25">
        {{ question }}
      </p>
      <div class="d-flex j-center g-25">
        <button
          type="button"
          class="btn btn-success pointer"
          data-valide
          @click="runCallBack"
        >
          <i class="fa-solid fa-check mr-5"></i>
          {{ t('confirm_button.valide') }}
        </button>
        <button
          type="button"
          data-cancel
          class="btn btn-danger pointer"
          @click="dialog.close()"
        >
          <i class="fa-solid fa-xmark mr-5"></i>
          {{ t('confirm_button.cancel') }}
        </button>
      </div>
    </DialogComponent>
  </div>
</template>

<style lang="scss">
.confirm-icon {
  height: 25px;

  .button-confirm {
    i { color: var(--primary); }

    &:hover, &:focus {
      i { color: var(--primary-300); }
    }

    &:focus {
      outline: 1px solid var(--primary-300);
      border-radius: 5px;
    }
  }

  &_icon {
    font-size: 1.4rem;
    transition: color linear 200ms;  

    &.success:hover { color: var(--success); }
    &.danger:hover { color: var(--danger); }
  }
}
</style>
