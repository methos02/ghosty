import { ref, readonly, inject } from 'vue'

export const NOVEL_FILTER_STORE_KEY = Symbol('novel-filter-store')

const novelFilterStore = () => {
  const search = ref('')
  const genreId = ref()

  const setSearch = value => {
    search.value = value
  }

  const setGenreId = value => {
    genreId.value = value
  }

  const serialize = () => ({
    search: search.value,
    genreId: genreId.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    search.value = data.search ?? ''
    genreId.value = data.genreId
  }

  return {
    search: readonly(search),
    genreId: readonly(genreId),
    setSearch,
    setGenreId,
    serialize,
    hydrate,
  }
}

export const createNovelFilterStore = () => novelFilterStore()

export const useNovelFilterStore = () => inject(NOVEL_FILTER_STORE_KEY)
