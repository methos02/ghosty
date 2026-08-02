import { ref, readonly, inject } from 'vue'

export const CHAPTER_STORE_KEY = Symbol('chapter-store')

export const createChapterStore = () => {
  const mainContinuity = ref([])
  const currentChapter = ref()

  const setMainContinuity = chapters => {
    mainContinuity.value = chapters
  }

  const setCurrentChapter = chapter => {
    currentChapter.value = chapter
  }

  const clearCurrentChapter = () => {
    currentChapter.value = undefined
  }

  const clear = () => {
    mainContinuity.value = []
    currentChapter.value = undefined
  }

  const serialize = () => ({
    mainContinuity: mainContinuity.value,
    currentChapter: currentChapter.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    mainContinuity.value = data.mainContinuity ?? []
    currentChapter.value = data.currentChapter
  }

  return {
    mainContinuity: readonly(mainContinuity),
    currentChapter: readonly(currentChapter),
    setMainContinuity,
    setCurrentChapter,
    clearCurrentChapter,
    clear,
    serialize,
    hydrate,
  }
}

export const useChapterStore = () => inject(CHAPTER_STORE_KEY)
