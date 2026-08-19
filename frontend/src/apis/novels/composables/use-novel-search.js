import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const useNovelSearch = () => {
  const novelStore = useNovelStore()
  const filterStore = useNovelFilterStore()

  const load = async page => {
    const response = await NovelController.list({
      page,
      search: filterStore.search.value,
      genreId: filterStore.genreId.value,
    })

    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    novelStore.addNovels(response.novels)
    novelStore.setPagination(response.pagination)

    return response
  }

  const restart = async () => {
    novelStore.reset()

    return await load(1)
  }

  const search = async term => {
    filterStore.setSearch(term)

    return await restart()
  }

  const filterByGenre = async genreId => {
    filterStore.setGenreId(genreId)

    return await restart()
  }

  const loadMore = async () => {
    if (!novelStore.hasMore()) {
      return { status: STATUS.SUCCESS }
    }

    return await load(novelStore.pagination.value.nextPage)
  }

  return {
    novelSearch: {
      search,
      filterByGenre,
      loadMore,
      restart,
    },
  }
}
