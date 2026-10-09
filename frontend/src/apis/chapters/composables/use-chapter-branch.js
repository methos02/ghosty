import { computed } from 'vue'
import { route } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { useTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { useChapterTree } from '@/apis/chapters/composables/use-chapter-tree.js'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'

export const useChapterBranch = () => {
  const { chapters, mainBranchIds, chosenIds, setChosenIds } = useTreeStore()
  const { chapterTree } = useChapterTree()
  const currentRoute = route.current()

  const novelSlug = computed(() => currentRoute.value.params.slug)

  const referenceId = computed(() => {
    const from = Number(currentRoute.value.query.from)

    return Number.isNaN(from) ? undefined : from
  })

  const selectedIds = computed(() => {
    if (chosenIds.value.length > 0) {
      return chosenIds.value
    }

    const readBranch = chapterTreeHelper.retraceBranch(chapters.value, referenceId.value)
    if (readBranch.length > 0) {
      return readBranch
    }

    return chapterTreeHelper.defaultSelection(chapters.value, mainBranchIds.value)
  })

  const branch = computed(() =>
    chapterTreeHelper.selectedChapters(chapters.value, selectedIds.value),
  )
  const lastSelected = computed(() => chapterTreeHelper.lastChapter(branch.value))
  const children = computed(() =>
    chapterTreeHelper.sortedChildren(chapters.value, lastSelected.value?.id),
  )

  const isOnMainBranch = chapter => {
    return mainBranchIds.value.includes(chapter.id)
  }

  const isInBranch = chapter => {
    return selectedIds.value.includes(chapter.id)
  }

  const countAlternatives = chapter => {
    return chapterTreeHelper.sortedChildren(chapters.value, chapter.parentId).length
  }

  const hasBranch = chapterId => {
    return chapterTreeHelper.retraceBranch(chapters.value, chapterId).length > 0
  }

  const revealChildren = async chapterId => {
    if (!chapterTreeHelper.hasHiddenChildren(chapters.value, chapterId)) {
      return { status: STATUS.SUCCESS }
    }

    return await chapterTree.expand(novelSlug.value, chapterId)
  }

  const selectId = async chapterId => {
    setChosenIds(chapterTreeHelper.moveBranchEnd(selectedIds.value, chapterId))

    return await revealChildren(chapterId)
  }

  const select = async chapter => {
    return await selectId(chapter.id)
  }

  const showAlternatives = async chapter => {
    return await selectId(chapter.parentId)
  }

  return {
    branch,
    children,
    lastSelected,
    referenceId,
    countAlternatives,
    hasBranch,
    isInBranch,
    isOnMainBranch,
    revealChildren,
    select,
    showAlternatives,
  }
}
