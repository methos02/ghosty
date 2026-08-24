<script setup>
import { computed } from 'vue'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'

const { ancestors } = useReadingStore()
const { selectedNovel } = useNovelStore()

const steps = computed(() => ancestors.value.slice(1))
</script>

<template>
  <nav
    v-if="steps.length > 0"
    class="branch-breadcrumb | d-flex f-wrap a-center g-10 fs-300 color-neutral-700"
  >
    <span
      v-for="(step, index) in steps"
      :key="step.id"
      class="branch-breadcrumb__step | d-flex a-center g-10"
    >
      <span
        v-if="index > 0"
        aria-hidden="true"
      >
        ›
      </span>
      <router-link
        :to="{ name: 'chapter-read', params: { slug: selectedNovel?.slug, id: step.id } }"
        class="branch-breadcrumb__ancestor"
      >
        {{ step.title }}
      </router-link>
    </span>
  </nav>
</template>

<style lang="scss" scoped>
.branch-breadcrumb {
  line-height: 1.6;
}
</style>
