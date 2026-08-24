<script setup>
import { computed } from 'vue'
import { router } from '@/services/shortcuts/services-shortcut.js'
import ChapterCard from '@/views/chapters/parts/ChapterCard.vue'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { POPULARITY } from '@/constants/chapter-constants.js'

const props = defineProps({
  chapter: { type: Object, required: true },
})

const { nextChapterId, isCurrentBranch } = useReadingStore()
const { selectedNovel } = useNovelStore()

const popularity = computed(() => {
  if (props.chapter.id !== nextChapterId.value) {
    return POPULARITY.NONE
  }

  if (isCurrentBranch.value) {
    return POPULARITY.NOVEL
  }

  return POPULARITY.BRANCH
})

const read = async () => {
  await router.push({
    name: 'chapter-read',
    params: { slug: selectedNovel.value?.slug, id: props.chapter.id },
  })
}
</script>

<template>
  <ChapterCard
    :chapter="chapter"
    :popularity="popularity"
    @pick="read"
  />
</template>
