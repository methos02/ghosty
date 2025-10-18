<script setup>
import {ref} from "vue";
import Loader from "@brugmann/vuemann/src/components/LoaderComponent.vue";
import DialogComponent from "@brugmann/vuemann/src/components/DialogComponent.vue";
import { t } from "@brugmann/vuemann/src/services/services-helper.js";

const props = defineProps({
  cb : { type: Function, required: true},
  params : { type: Array, default: []},
  question : { type: String, default: '' },
})

const dialog = ref()
const loader = ref()
const state = ref('init')
const runCallBack = async () => {
  loader.value.runCallBack()
  state.value = 'init'

  if(props.question !== '') { dialog.value.close() }
}

const clickEvent = () => {
  state.value = 'confirm'
  
  if(props.question !== '') { dialog.value.show() }
}
</script>

<template>
  <div class="confirm-buttons_container">
    <div class="confirm-buttons">
      <div class="button-confirm">
        <Loader
          v-show="state === 'init' || question === ''"
          ref="loader"
          @click="clickEvent"
          :cb="cb"
          :params="params"
          data-confirm
        >
          <slot></slot>
        </Loader>
      </div>
      <div 
        v-if="question === ''"
        v-show="state === 'confirm'" 
        class="f-center g-10"
        data-buttons
      >
        <button
            type="button"
            class="button-valide | btn btn-success pointer"
            data-valide
            @click="runCallBack"
        >
          <i class="fa-solid fa-check mr-5"></i>
          {{ t('confirm_button.valide') }}
        </button>
        <button
            type="button"
            data-cancel
            class="button-cancel | btn btn-danger pointer"
            @click="state = 'init'"
        >
          <i class="fa-solid fa-xmark  mr-5"></i>
          {{ t('confirm_button.cancel') }}
        </button>
      </div>
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
          <i class="fa-solid fa-xmark  mr-5"></i>
          {{ t('confirm_button.cancel') }}
        </button>
      </div>
    </DialogComponent>
  </div>
</template>
