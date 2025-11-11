<script setup>
import { ref } from 'vue'

const props = defineProps({
  type: { type: String, default: 'bars' },
  click: { type: Function, default: undefined },
  cb: { type: Function, default: undefined },
  params: { type: Array, default: () => [] },
  infinite: { type: Boolean, default: false },
  buttonClasses: { type: String, default: '' },
  buttonType: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})

if (!props.click && !props.cb) {
  throw new Error('LoaderComponent: La propriété click ou cb doit être renseignée')
}

const button = ref()
const loading = ref(false)
const size = ref({ width: undefined, height: undefined })
const callback = ref(props.click || props.cb)

const execute = async () => {
  if (loading.value || props.disabled || !callback.value) { return }

  setLoad(true)

  try {
    await callback.value(...props.params)
  } finally {
    if (props.infinite) { return }
    setLoad(false)
  }
}

const clickEvent = () => execute()
const runCallback = () => execute()

const setLoad = state => {
  if (size.value.height === undefined) { defineButtonSize() }
  loading.value = state
}

const EXTRA_PADDING = 5
const defineButtonSize = () => {
  if (!button.value) { return }

  const styles = globalThis.getComputedStyle(button.value)
  const buttonWidth = Number.parseFloat(styles.borderRightWidth) + Number.parseFloat(styles.borderLeftWidth) + button.value.clientWidth
  const buttonHeight = Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth) + button.value.clientHeight

  if (buttonHeight === 0) { return }

  size.value = { height: buttonHeight + 'px', width: (buttonWidth + EXTRA_PADDING) + 'px' }
}

defineExpose({ setLoad, loading, runCallback })
</script>
<template>
  <button
    ref="button"
    @click="clickEvent"
    :class="[buttonClasses, { 'btn-loading': loading }]"
    :type="buttonType"
    :disabled="loading || disabled"
    :style="{ height: size.height, width: size.width }"
  >
    <span v-if="!loading" class="btn-content">
      <slot></slot>
    </span>
    <span v-if="loading" class="loader-spinner"></span>
  </button>
</template>

<style lang="scss" scoped>
.btn-loading {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loader-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
