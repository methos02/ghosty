import { ref, readonly, inject } from 'vue'

export const NOVEL_STORE_KEY = Symbol('novel-store')

const defaultPagination = () => ({
  nextPage: 1,
  lastPage: 1,
})

const novelStore = () => {
  const novels = ref([])
  const pagination = ref(defaultPagination())
  const selectedNovel = ref()

  const addNovels = loaded => {
    novels.value.push(...loaded)
  }

  const setPagination = value => {
    pagination.value = value
  }

  const reset = () => {
    novels.value = []
    pagination.value = defaultPagination()
  }

  const hasMore = () => {
    return pagination.value.nextPage <= pagination.value.lastPage
  }

  const setSelectedNovel = novel => {
    selectedNovel.value = novel
  }

  const clearSelectedNovel = () => {
    selectedNovel.value = undefined
  }

  const serialize = () => ({
    novels: novels.value,
    pagination: pagination.value,
    selectedNovel: selectedNovel.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    novels.value = data.novels ?? []
    pagination.value = data.pagination ?? defaultPagination()
    selectedNovel.value = data.selectedNovel
  }

  return {
    novels: readonly(novels),
    pagination: readonly(pagination),
    selectedNovel: readonly(selectedNovel),
    addNovels,
    setPagination,
    reset,
    hasMore,
    setSelectedNovel,
    clearSelectedNovel,
    serialize,
    hydrate,
  }
}

export const createNovelStore = () => novelStore()

export const useNovelStore = () => inject(NOVEL_STORE_KEY)
