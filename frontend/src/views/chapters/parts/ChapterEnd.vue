<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import ChildrenSwitcher from '@/views/chapters/parts/ChildrenSwitcher.vue'

defineProps({
  novelSlug: { type: String, required: true },
  chapterId: { type: Number, required: true },
  children: { type: Array, default: () => [] },
  canCorrect: { type: Boolean, default: false },
})
</script>

<template>
  <section class="chapter-end | d-flex f-column g-20">
    <p class="chapter-end__mark | text-center fs-300 color-neutral-700">
      {{ t('chapter_read.end_of_chapter') }}
    </p>

    <ChildrenSwitcher :children="children" />

    <div class="chapter-end__actions | d-flex f-wrap j-center g-10">
      <router-link
        :to="{ name: 'chapter-write', params: { slug: novelSlug, parentId: chapterId } }"
        class="chapter-end__continue | btn btn-primary"
      >
        {{ t('chapter_read.continue') }}
      </router-link>

      <router-link
        :to="{ name: 'multiverse', params: { slug: novelSlug }, query: { from: chapterId } }"
        class="chapter-end__multiverse | btn btn-primary-alt"
      >
        {{ t('common.explore_novel') }}
      </router-link>

      <router-link
        v-if="canCorrect"
        :to="{ name: 'chapter-edit', params: { id: chapterId } }"
        class="chapter-end__correct | btn btn-primary-alt"
      >
        {{ t('chapter_read.correct') }}
      </router-link>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.chapter-end {
  &__mark {
    border-top: 1px solid var(--neutral-300);
    padding-top: 20px;
  }
}
</style>
