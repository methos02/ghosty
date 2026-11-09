import { ref, readonly } from 'vue'

const summarisedChapter = ref()

const openChapterSummary = chapter => {
  summarisedChapter.value = chapter
}

const closeChapterSummary = () => {
  summarisedChapter.value = undefined
}

export const useChapterSummary = () => {
  return {
    summarisedChapter: readonly(summarisedChapter),
    openChapterSummary,
    closeChapterSummary,
  }
}
