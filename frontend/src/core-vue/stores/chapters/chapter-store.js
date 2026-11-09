import { ref, readonly, inject } from 'vue'

export const CHAPTER_STORE_KEY = Symbol('chapter-store')

const chapterStore = () => {
  const mainBranch = ref([])
  const currentChapter = ref()

  const setMainBranch = chapters => {
    mainBranch.value = chapters
  }

  const setCurrentChapter = chapter => {
    currentChapter.value = chapter
  }

  const clearCurrentChapter = () => {
    currentChapter.value = undefined
  }

  const clear = () => {
    mainBranch.value = []
    currentChapter.value = undefined
  }

  const serialize = () => ({
    mainBranch: mainBranch.value,
    currentChapter: currentChapter.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    mainBranch.value = data.mainBranch ?? []
    currentChapter.value = data.currentChapter
  }

  return {
    mainBranch: readonly(mainBranch),
    currentChapter: readonly(currentChapter),
    setMainBranch,
    setCurrentChapter,
    clearCurrentChapter,
    clear,
    serialize,
    hydrate,
  }
}

export const createChapterStore = () => chapterStore()

export const useChapterStore = () => inject(CHAPTER_STORE_KEY)
