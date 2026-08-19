import { ref, readonly, inject } from 'vue'

export const CHAPTER_STORE_KEY = Symbol('chapter-store')

const chapterStore = () => {
  const currentContinuity = ref([])
  const currentChapter = ref()

  const setCurrentContinuity = chapters => {
    currentContinuity.value = chapters
  }

  const setCurrentChapter = chapter => {
    currentChapter.value = chapter
  }

  const clearCurrentChapter = () => {
    currentChapter.value = undefined
  }

  const clear = () => {
    currentContinuity.value = []
    currentChapter.value = undefined
  }

  const serialize = () => ({
    currentContinuity: currentContinuity.value,
    currentChapter: currentChapter.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    currentContinuity.value = data.currentContinuity ?? []
    currentChapter.value = data.currentChapter
  }

  return {
    currentContinuity: readonly(currentContinuity),
    currentChapter: readonly(currentChapter),
    setCurrentContinuity,
    setCurrentChapter,
    clearCurrentChapter,
    clear,
    serialize,
    hydrate,
  }
}

export const createChapterStore = () => chapterStore()

export const useChapterStore = () => inject(CHAPTER_STORE_KEY)
