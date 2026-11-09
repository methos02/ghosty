import { ref, readonly } from 'vue'

const defaultPagination = () => ({
  nextPage: 1,
  lastPage: 1,
})

const comments = ref([])
const pagination = ref(defaultPagination())
const commentCount = ref()

const isShownInThread = comment => !comment.isDeleted || comment.replies.length > 0

const asDeleted = comment => ({
  ...comment,
  author: undefined,
  content: '',
  isDeleted: true,
})

const withReply = (comment, reply) => ({
  ...comment,
  replies: [...comment.replies, reply],
})

const withoutReply = (comment, reply) => ({
  ...comment,
  replies: comment.replies.filter(shownReply => shownReply.id !== reply.id),
})

const removeReply = reply => {
  comments.value = comments.value
    .map(comment => (comment.id === reply.parentId ? withoutReply(comment, reply) : comment))
    .filter(comment => isShownInThread(comment))
}

const removeTopLevel = removed => {
  comments.value = comments.value
    .map(comment => (comment.id === removed.id ? asDeleted(comment) : comment))
    .filter(comment => isShownInThread(comment))
}

const addComment = comment => {
  comments.value = [comment, ...comments.value]
}

const addComments = loaded => {
  const loadedIds = new Set(comments.value.map(comment => comment.id))
  const unseen = loaded.filter(comment => !loadedIds.has(comment.id))

  comments.value = [...comments.value, ...unseen]
}

const addReply = reply => {
  comments.value = comments.value.map(comment =>
    comment.id === reply.parentId ? withReply(comment, reply) : comment,
  )
}

const clear = () => {
  comments.value = []
  pagination.value = defaultPagination()
  commentCount.value = undefined
}

const hasMore = () => pagination.value.nextPage <= pagination.value.lastPage

const removeComment = comment => {
  if (comment.parentId !== null) {
    removeReply(comment)
    return
  }

  removeTopLevel(comment)
}

const setCommentCount = value => {
  commentCount.value = value
}

const setPagination = value => {
  pagination.value = value
}

export const useCommentStore = () => ({
  comments: readonly(comments),
  pagination: readonly(pagination),
  commentCount: readonly(commentCount),
  commentStore: {
    addComment,
    addComments,
    addReply,
    clear,
    hasMore,
    removeComment,
    setCommentCount,
    setPagination,
  },
})
