const LAST_CHAPTER = -1

const byPopularity = (first, second) => second.branchLikeCount - first.branchLikeCount

const rootOf = (chapters = []) => {
  const loadedIds = new Set(chapters.map(chapter => chapter.id))

  return chapters.find(chapter => !loadedIds.has(chapter.parentId))
}

const childrenOf = (chapters = [], parentId) => {
  return chapters.filter(chapter => chapter.parentId === parentId).toSorted(byPopularity)
}

const selectedChapters = (chapters = [], selectedIds = []) => {
  const byId = new Map(chapters.map(chapter => [chapter.id, chapter]))

  return selectedIds.map(id => byId.get(id)).filter(Boolean)
}

const pathTo = (chapters = [], chapterId) => {
  const byId = new Map(chapters.map(chapter => [chapter.id, chapter]))
  const path = []
  let step = byId.get(chapterId)

  while (step !== undefined) {
    path.push(step.id)
    step = byId.get(step.parentId)
  }

  return path.toReversed()
}

const defaultSelection = (chapters = [], currentBranchIds = []) => {
  if (currentBranchIds.length > 0) {
    return [...currentBranchIds]
  }

  const root = rootOf(chapters)
  if (root === undefined) {
    return []
  }

  return [root.id]
}

const selectionUpTo = (selectedIds = [], chapterId) => {
  if (!selectedIds.includes(chapterId)) {
    return [...selectedIds, chapterId]
  }

  return selectedIds.slice(0, selectedIds.indexOf(chapterId) + 1)
}

const lastOf = (chapters = []) => chapters.at(LAST_CHAPTER)

const hasHiddenChildren = (chapters = [], chapterId) => {
  const chapter = chapters.find(candidate => candidate.id === chapterId)
  if (chapter === undefined) {
    return false
  }

  return chapter.childrenCount > childrenOf(chapters, chapterId).length
}

export const chapterTreeHelper = {
  rootOf,
  childrenOf,
  selectedChapters,
  defaultSelection,
  pathTo,
  selectionUpTo,
  lastOf,
  hasHiddenChildren,
}
