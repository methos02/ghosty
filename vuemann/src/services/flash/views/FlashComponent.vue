<script setup>
import { useFlashStore } from '../src/flash-store'
import { storeToRefs } from 'pinia'

const flashStore = useFlashStore()
const { flashes } = storeToRefs(flashStore)
</script>

<template>
  <div class="container-flash">
    <div
      v-for="flash in flashes"
      :key="flash.id"
      :class="
        `flash flash-${flash.type}` + (flash.hide !== undefined ? ' hide' : '')
      "
      @mouseenter="flash.autodelete = false"
      @mouseleave="flash.autodelete = true"
      :data-flash="flash.id"
    >
      <button class="flash-close" @click="flashStore.removeFlash(flash.id)">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p>
        {{ flash.content }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use 'sass:map';
@use '../../../assets/scss/_variables';

.container-flash {
  position: fixed;
  top: 75px;
  right: -500px;
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
    bg: variables.$danger-300,
    color: variables.$danger,
  ),
  success: (
    bg: variables.$success-300,
    color: variables.$success,
  ),
  info: (
    bg: variables.$info-300,
    color: variables.$info,
  ),
  warning: (
    bg: variables.$warning-300,
    color: variables.$warning,
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
