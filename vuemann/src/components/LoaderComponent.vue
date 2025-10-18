<script setup>
import { ref } from 'vue'

const props = defineProps({
  type : { type: String, default: 'bars'},
  cb: { type: Function, default: undefined},
  click: { type: Function, default: undefined }, 
  params : { type: Array, default: []},
  infinite: { type: Boolean, default: false },
  buttonClasses: { type: String, default: undefined },
  buttonType: { type: String, default: 'button' },
})

const validateProps = () => {
  if (!props.click && !props.cb) {
    throw new Error("La propriété cb ou click doivent être renseigné");
  }
};

validateProps();

const button = ref()
const loading = ref(false)
const size = ref({ width: undefined, height: undefined })

const clickEvent = async () => {
  if (props.click === undefined) { return }
  setLoad(true)
  await props.click(...props.params)
  if(!props.infinite) { setLoad(false) }
}

const runCallBack = async () => {
  setLoad(true)
  await props.cb(...props.params)
  if(!props.infinite) { setLoad(false) }
}

const setLoad = state => { 
  if(size.value.height === undefined) { defineButtonSize() }
  loading.value = state 
}

const EXTRA_PADDING = 5;
const defineButtonSize = ()=> {
  const styles = globalThis.getComputedStyle(button.value);

  const buttonWidth = Number.parseFloat(styles.borderRightWidth) + Number.parseFloat(styles.borderLeftWidth) + button.value.clientWidth
  const buttonHeight = Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth) + button.value.clientHeight

  if(buttonHeight === 0) { return }

  size.value = { 
    height: buttonHeight + 'px', 
    width: (buttonWidth + EXTRA_PADDING) + 'px' 
  } 
}

defineExpose({ setLoad, runCallBack })
</script>
<template>
  <div class="loader_container">
    <button 
      v-if="type === 'bars'"
      ref="button" 
      @click="clickEvent" 
      class="loader-tabs"
      :class="buttonClasses ?? 'btn btn-primary'" 
      :type="buttonType"
      :style="{ height: size.height, width: size.width }"
    >
      <slot v-if="!loading" ></slot>
      <span
        v-if="loading"
        class="loader loader-bars"
        data-loader
      >
        <span></span>
      </span>
    </button>
    <button 
      v-if="type === 'icon'"
      ref="button" 
      @click="clickEvent" 
      class="loader-icon | pointer f-center"
      :class="buttonClasses" 
      :type="buttonType"
      :style="{ height: size.height, width: size.width }"
    >
      <slot v-if="!loading" ></slot>
      <span
        v-if="loading"
        class="loader-spin"
        data-loader
      >
      </span>
    </button>
  </div>
</template>

