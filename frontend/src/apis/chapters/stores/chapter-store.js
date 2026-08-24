import { ref, readonly, inject } from 'vue'

export const CHAPTER_STORE_KEY = Symbol('chapter-store')

const chapterStore = () => {
  const currentBranch = ref([])
  const currentChapter = ref()

  const setCurrentBranch = chapters => {
    currentBranch.value = chapters
  }

  const setCurrentChapter = chapter => {
    currentChapter.value = chapter
  }

  const clearCurrentChapter = () => {
    currentChapter.value = undefined
  }

  const clear = () => {
    currentBranch.value = []
    currentChapter.value = undefined
  }

  const serialize = () => ({
    currentBranch: currentBranch.value,
    currentChapter: currentChapter.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    currentBranch.value = data.currentBranch ?? []
    currentChapter.value = data.currentChapter
  }

  return {
    currentBranch: readonly(currentBranch),
    currentChapter: readonly(currentChapter),
    setCurrentBranch,
    setCurrentChapter,
    clearCurrentChapter,
    clear,
    serialize,
    hydrate,
  }
}

export const createChapterStore = () => chapterStore()

export const useChapterStore = () => inject(CHAPTER_STORE_KEY)
