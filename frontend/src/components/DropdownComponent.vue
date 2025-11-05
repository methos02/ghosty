<script setup>
import { vOnClickOutside } from '@vueuse/components'
import {ref} from "vue";

const props = defineProps({
  orientation: { type: String, default: '' },
  classes: { type: String, default: '' },
  autoToggle: { type: Boolean, default: true }
})

const active = ref(false)

const autoToggleFunction = () => {
  if(props.autoToggle !== true) { return }
  toggle()
}

const show = () => {
  active.value = true
  emit('show')
}

const hide = () => {
  if(active.value === false) { return }
  active.value = false
  emit('hide')
}

const toggle = state => {
  active.value = state ?? !active.value
  emit(active.value ? 'show' : 'hide')
}

const emit = defineEmits(['hide', 'show'])
defineExpose({show, hide, toggle})
</script>

<template>
  <div class="dropdown" v-on-click-outside.bubble="hide">
    <div id="dropdown-button" @click="autoToggleFunction">
      <slot name="button"></slot>
    </div>
    <div
      data-items
      v-show="active"
      class="dropdown-items bottom"
      :class="`${orientation} ${classes}`"
    >
      <slot name="items"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/scss/variables';

.dropdown { position: relative; }

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
    &:not(.overflow) { width: 100%; }
  }

  &.bottom { top: calc(100% + 2px); }
  &.left { left: 0; }
  &.right { right: 0; }

  &.top {
    bottom: 45px;
    right: 5px;
    transform-origin: center bottom;
  }
}
</style>
