<script setup>
import { computed, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ReadingChapterCard from '@/views/chapters/parts/ReadingChapterCard.vue'

const VISIBLE_BY_DEFAULT = 3

const props = defineProps({
  children: { type: Array, default: () => [] },
})

const isShowingAllSuites = ref(false)

const visibleSuites = computed(() => {
  if (isShowingAllSuites.value) {
    return props.children
  }

  return props.children.slice(0, VISIBLE_BY_DEFAULT)
})

const hiddenCount = computed(() => props.children.length - visibleSuites.value.length)
</script>

<template>
  <section class="children-switcher | d-flex f-column g-15">
    <h2 class="children-switcher__title | fs-500 fw-500">
      {{ t('children_switcher.title', { count: children.length }) }}
    </h2>

    <p
      v-if="children.length === 0"
      class="children-switcher__empty | color-neutral-700"
    >
      {{ t('children_switcher.empty') }}
    </p>

    <ul class="children-switcher__list | d-flex f-column g-10">
      <li
        v-for="child in visibleSuites"
        :key="child.id"
        class="children-switcher__item"
      >
        <ReadingChapterCard :chapter="child" />
      </li>
    </ul>

    <button
      v-if="hiddenCount > 0"
      type="button"
      class="children-switcher__more | btn btn-sm btn-primary-alt"
      @click="isShowingAllSuites = true"
    >
      {{ t('children_switcher.show_more', { count: hiddenCount }) }}
    </button>
  </section>
</template>
