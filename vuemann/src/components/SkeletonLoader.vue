<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '20px' },
})
</script>

<template>
  <div
    class="skeleton-loader"
    :style="{ width: width, height: height }"
  ></div>
</template>

<style lang="scss">
.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
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
