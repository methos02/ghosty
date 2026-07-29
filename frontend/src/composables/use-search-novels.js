import { ref, readonly, inject } from 'vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const SEARCH_NOVELS_KEY = Symbol('search-novels')

const defaultPagination = () => ({
  nextPage: 1,
  lastPage: 1,
})

export const createSearchNovelsStore = () => {
  const selectedSort = ref('Top 10')
  const selectedGenre = ref('Tous')
  const novels = ref([])
  const pagination = ref(defaultPagination())

  const setSort = value => {
    selectedSort.value = value
  }

  const setGenre = value => {
    selectedGenre.value = value
  }

  const loadNovels = async (page = 1) => {
    const response = await NovelController.list(page)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    novels.value.push(...response.novels)
    pagination.value = response.pagination
    return response
  }

  const loadMore = async () => {
    if (pagination.value.nextPage > pagination.value.lastPage) {
      return { status: STATUS.SUCCESS }
    }

    return await loadNovels(pagination.value.nextPage)
  }

  const hasMore = () => {
    return pagination.value.nextPage <= pagination.value.lastPage
  }

  const serialize = () => ({
    selectedSort: selectedSort.value,
    selectedGenre: selectedGenre.value,
    novels: novels.value,
    pagination: pagination.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    selectedSort.value = data.selectedSort ?? 'Top 10'
    selectedGenre.value = data.selectedGenre ?? 'Tous'
    novels.value = data.novels ?? []
    pagination.value = data.pagination ?? defaultPagination()
  }

  return {
    selectedSort: readonly(selectedSort),
    selectedGenre: readonly(selectedGenre),
    novels: readonly(novels),
    pagination: readonly(pagination),
    setSort,
    setGenre,
    loadNovels,
    loadMore,
    hasMore,
    serialize,
    hydrate,
  }
}

export const useSearchNovels = () => inject(SEARCH_NOVELS_KEY)
