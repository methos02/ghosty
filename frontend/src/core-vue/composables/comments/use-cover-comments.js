import { ref, readonly } from 'vue'

const commentedCover = ref()

const close = () => {
  commentedCover.value = undefined
}

const open = cover => {
  commentedCover.value = cover
}

export const useCoverComments = () => {
  return {
    commentedCover: readonly(commentedCover),
    coverComments: {
      close,
      open,
    },
  }
}
