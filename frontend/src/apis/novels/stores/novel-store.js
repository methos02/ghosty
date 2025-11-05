import { ref, readonly } from 'vue'

const novels = ref([])
const isLoading = ref(false)

export const useNovelStore = () => {
  const setNovels = (newNovels) => {
    novels.value = newNovels
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  return {
    novels: readonly(novels),
    isLoading: readonly(isLoading),
    setNovels,
    setLoading
  }
}
