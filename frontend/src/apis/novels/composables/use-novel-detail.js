import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

export const useNovelDetail = () => {
  const novelStore = useNovelStore()

  const selectBySlug = async novelSlug => {
    if (novelStore.selectedNovel.value?.slug === novelSlug) {
      return { status: STATUS.SUCCESS }
    }

    const response = await NovelController.getBySlug(novelSlug)
    if (!ajaxHelper.isSuccess(response.status)) {
      return response
    }

    novelStore.setSelectedNovel(response.novel)

    return response
  }

  return {
    novelDetail: {
      selectBySlug,
    },
  }
}
