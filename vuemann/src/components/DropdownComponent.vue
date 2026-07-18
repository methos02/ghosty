<script setup>
import { vOnClickOutside } from '@vueuse/components'
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  orientation: { type: String, default: '' },
  classes: { type: String, default: '' },
  autoToggle: { type: Boolean, default: true },
})

const active = ref(false)
const dropdownReference = ref()
const itemsReference = ref()
const verticalPosition = ref('bottom')

const computeVerticalPosition = () => {
  if (dropdownReference.value === undefined || itemsReference.value === undefined) {
    return 'bottom'
  }
  const spaceBelow = window.innerHeight - dropdownReference.value.getBoundingClientRect().bottom
  return spaceBelow < itemsReference.value.offsetHeight ? 'top' : 'bottom'
}

watch(active, async isActive => {
  if (!isActive) {
    return
  }
  await nextTick()
  verticalPosition.value = computeVerticalPosition()
})

const autoToggleFunction = () => {
  if (props.autoToggle !== true) {
    return
  }
  toggle()
}

const show = () => {
  active.value = true
  emit('show')
}

const hide = () => {
  if (active.value === false) {
    return
  }
  verticalPosition.value = 'bottom'
  active.value = false
  emit('hide')
}

const toggle = (shouldShow = !active.value) => {
  shouldShow ? show() : hide()
}

const emit = defineEmits(['hide', 'show'])
defineExpose({
  show,
  hide,
  toggle,
})
</script>

<template>
  <div
    ref="dropdownReference"
    class="dropdown"
    v-on-click-outside.bubble="hide"
  >
    <div
      id="dropdown-button"
      @click="autoToggleFunction"
    >
      <slot name="button"></slot>
    </div>
    <div
      ref="itemsReference"
      data-items
      v-show="active"
      class="dropdown-items"
      :class="[verticalPosition, orientation, classes]"
    >
      <slot name="items"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/scss/variables';

.dropdown {
  position: relative;
}

.dropdown-items {
  min-width: 100%;
  background-color: white;
  border: 1px solid #e3e2e2;
  box-shadow: 0 10px 6px -6px #c9bebe;
  border-radius: 5px;
  transform-origin: top center;
  transition: transform 300ms;
  position: absolute;
  z-index: 5;

  @media (max-width: variables.$md) {
    &:not(.overflow) {
      width: 100%;
    }
  }

  &.bottom {
    top: calc(100% + 2px);
  }
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }

  &.top {
    bottom: calc(100% + 2px);
    transform-origin: center bottom;
  }
}
</style>
