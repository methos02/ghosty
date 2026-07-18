<script setup>
import { ref } from 'vue'
import { pixelHelper } from '@brugmann/vuemann/src/helpers/pixel-helper.js'

const props = defineProps({
  type: { type: String, default: 'bars' },
  cb: { type: Function, default: undefined },
  click: { type: Function, default: undefined },
  params: { type: Array, default: [] },
  infinite: { type: Boolean, default: false },
  buttonClasses: { type: String, default: undefined },
  buttonType: { type: String, default: 'button' },
})

const validateProps = () => {
  if (!props.click && !props.cb) {
    throw new Error('La propriété cb ou click doivent être renseigné')
  }
}

validateProps()

const button = ref()
const loading = ref(false)
const sizeDefault = { width: undefined, height: undefined }
const size = ref({ ...sizeDefault })

const clickEvent = async () => {
  if (loading.value || props.click === undefined) {
    return
  }
  setLoad(true)
  await props.click(...props.params)
  if (!props.infinite) {
    setLoad(false)
  }
}

const runCallback = async () => {
  if (loading.value) {
    return
  }
  setLoad(true)
  await props.cb(...props.params)
  if (!props.infinite) {
    setLoad(false)
  }
}

const setLoad = state => {
  if (state === true) {
    defineButtonSize()
  }
  if (state === false) {
    size.value = { ...sizeDefault }
  }

  loading.value = state
}

const defineButtonSize = () => {
  const styles = globalThis.getComputedStyle(button.value)

  const buttonWidth =
    pixelHelper.pxToNumber(styles.borderRightWidth) +
    pixelHelper.pxToNumber(styles.borderLeftWidth) +
    button.value.clientWidth

  const buttonHeight =
    pixelHelper.pxToNumber(styles.borderTopWidth) +
    pixelHelper.pxToNumber(styles.borderBottomWidth) +
    button.value.clientHeight

  if (buttonHeight === 0) {
    return
  }

  size.value = {
    height: pixelHelper.numberToPx(buttonHeight),
    width: pixelHelper.numberToPx(buttonWidth),
  }
}

defineExpose({ setLoad, runCallback })
</script>
<template>
  <div class="loader_container">
    <button
      v-if="type === 'bars'"
      ref="button"
      @click="clickEvent"
      class="loader-tabs"
      :class="buttonClasses ?? 'btn btn-primary btn-primary-400-active'"
      :type="buttonType"
      :disabled="loading"
      :style="{ height: size.height, width: size.width }"
    >
      <slot v-if="!loading"></slot>
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
      :disabled="loading"
      :style="{ height: size.height, width: size.width }"
    >
      <slot v-if="!loading"></slot>
      <span
        v-if="loading"
        class="loader-spin"
        data-loader
      >
      </span>
    </button>
  </div>
</template>
