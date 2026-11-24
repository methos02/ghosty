<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '20px' },
})
</script>

<template>
  <span
    v-if="$slots.default"
    class="skeleton-loader skeleton-loader--text"
  >
    <slot></slot>
  </span>
  <div
    v-else
    class="skeleton-loader | radius-5"
    :style="{ width, height }"
  ></div>
</template>

<style lang="scss" scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    var(--neutral-300) 25%,
    var(--neutral-400) 50%,
    var(--neutral-300) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;

  &--text {
    color: transparent;
    border-radius: 5px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
