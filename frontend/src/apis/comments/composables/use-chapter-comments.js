import { ref, readonly } from 'vue'

const commentedChapter = ref()

const openChapterComments = chapter => {
  commentedChapter.value = chapter
}

const closeChapterComments = () => {
  commentedChapter.value = undefined
}

export const useChapterComments = () => {
  return {
    commentedChapter: readonly(commentedChapter),
    openChapterComments,
    closeChapterComments,
  }
}
