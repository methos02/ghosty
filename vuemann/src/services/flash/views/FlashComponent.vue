<script setup>
import { ref, watch } from 'vue'
import { flash as flashHelper } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const { flashes } = flashHelper
const container = ref()

watch(
  () => flashes.value.length,
  (newLength, oldLength) => {
    if (newLength <= oldLength) {
      return
    }
    if (container.value.matches(':popover-open')) {
      container.value.hidePopover()
    }
    container.value.showPopover()
  },
)
</script>

<template>
  <div
    ref="container"
    popover="manual"
    class="container-flash"
  >
    <div
      v-for="flash in flashes"
      :key="flash.id"
      class="flash"
      :class="{
        [`flash-${flash.type}`]: true,
        hide: flash.hide !== undefined,
      }"
      @mouseenter="flash.autodelete = false"
      @mouseleave="flash.autodelete = true"
      :data-flash="flash.id"
    >
      <button
        class="flash-close"
        @click="flashHelper.removeFlash(flash.id)"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p>
        {{ flash.content }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.container-flash {
  position: fixed;
  inset: 75px -500px auto auto;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  overflow: visible;
  width: auto;
  height: auto;
  z-index: 100;
}

.flash {
  display: flex;
  gap: 15px;
  align-items: center;
  position: relative;
  max-width: 95vw;
  font-weight: 500;
  padding: 15px;
  margin-bottom: 5px;
  transition:
    opacity 200ms,
    transform 200ms;
  transform: translateX(0);
  transform-origin: right;
  box-shadow: 0 0 3px #444;
  animation: showFlash 300ms both;
  &.hide {
    animation: hideFlash 300ms both;
  }

  &.flash-lock {
    border-radius: 5px;
    text-align: center;
    margin: 5px 0;
  }

  &-close {
    cursor: pointer;
    transition: scale 300ms;
    &:hover {
      scale: 1.2;
    }
  }
}

$flash_colors: (
  error: (
    bg: var(--danger-300),
    color: var(--danger),
  ),
  success: (
    bg: var(--success-100),
    color: var(--success),
  ),
  info: (
    bg: var(--info-300),
    color: var(--info),
  ),
  warning: (
    bg: var(--warning-100),
    color: var(--warning),
  ),
);

@each $name, $param in $flash_colors {
  .flash.flash-#{$name} {
    border-left: 3px solid map.get($param, color);
    color: map.get($param, color);
    background-color: map.get($param, bg);

    .flash-close {
      color: map.get($param, color);
    }
  }
}

@keyframes showFlash {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-500px);
  }
}
@keyframes hideFlash {
  0% {
    transform: translateX(-500px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
