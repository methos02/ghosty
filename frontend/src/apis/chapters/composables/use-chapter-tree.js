import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const useChapterTree = () => {
  const treeStore = useTreeStore()

  const load = async (novelSlug, fromChapterId) => {
    const response = await ChapterController.tree(novelSlug, fromChapterId)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    treeStore.setTree(response)

    return response
  }

  const expand = async (novelSlug, fromChapterId) => {
    const response = await ChapterController.tree(novelSlug, fromChapterId)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    treeStore.addChapters(response.chapters)

    return response
  }

  return {
    chapterTree: {
      load,
      expand,
    },
  }
}
