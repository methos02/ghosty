import { ref, readonly, inject } from 'vue'

export const READING_STORE_KEY = Symbol('reading-store')

const readingStore = () => {
  const chapter = ref()
  const ancestors = ref([])
  const children = ref([])
  const branchChapterIds = ref([])
  const isMainBranch = ref(false)
  const nextChapterId = ref()

  const setReading = reading => {
    chapter.value = reading.chapter
    ancestors.value = reading.ancestors
    children.value = reading.children
    branchChapterIds.value = reading.branchChapterIds
    isMainBranch.value = reading.isMainBranch
    nextChapterId.value = reading.nextChapterId
  }

  const setChapterLike = (chapterId, like) => {
    if (chapter.value?.id !== chapterId) {
      return
    }

    chapter.value = {
      ...chapter.value,
      isLiked: like.isLiked,
      likeCount: like.likeCount,
    }
  }

  const clear = () => {
    chapter.value = undefined
    ancestors.value = []
    children.value = []
    branchChapterIds.value = []
    isMainBranch.value = false
    nextChapterId.value = undefined
  }

  const serialize = () => ({
    chapter: chapter.value,
    ancestors: ancestors.value,
    children: children.value,
    branchChapterIds: branchChapterIds.value,
    isMainBranch: isMainBranch.value,
    nextChapterId: nextChapterId.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    chapter.value = data.chapter
    ancestors.value = data.ancestors ?? []
    children.value = data.children ?? []
    branchChapterIds.value = data.branchChapterIds ?? []
    isMainBranch.value = data.isMainBranch === true
    nextChapterId.value = data.nextChapterId
  }

  return {
    chapter: readonly(chapter),
    ancestors: readonly(ancestors),
    children: readonly(children),
    branchChapterIds: readonly(branchChapterIds),
    isMainBranch: readonly(isMainBranch),
    nextChapterId: readonly(nextChapterId),
    setReading,
    setChapterLike,
    clear,
    serialize,
    hydrate,
  }
}

export const createReadingStore = () => readingStore()

export const useReadingStore = () => inject(READING_STORE_KEY)
