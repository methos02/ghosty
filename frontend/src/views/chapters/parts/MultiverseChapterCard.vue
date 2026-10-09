<script setup>
import { computed } from 'vue'
import ChapterCard from '@/views/chapters/parts/ChapterCard.vue'
import { useChapterBranch } from '@/apis/chapters/composables/use-chapter-branch.js'
import { POPULARITY } from '@/constants/chapter-constants.js'

const props = defineProps({
  chapter: { type: Object, required: true },
})

const { select, showAlternatives, isInBranch, isOnMainBranch, countAlternatives } =
  useChapterBranch()

const isSelected = computed(() => isInBranch(props.chapter))
const popularity = computed(() => {
  if (isOnMainBranch(props.chapter)) {
    return POPULARITY.NOVEL
  }

  return POPULARITY.NONE
})
const alternativesCount = computed(() => countAlternatives(props.chapter))
</script>

<template>
  <ChapterCard
    :chapter="chapter"
    :isSelected="isSelected"
    :popularity="popularity"
    :alternativesCount="alternativesCount"
    :opensNewTab="true"
    @pick="select(chapter)"
    @alternatives="showAlternatives(chapter)"
  />
</template>
