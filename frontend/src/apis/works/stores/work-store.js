import { ref, readonly } from 'vue'

const currentWork = ref(null)
const works = ref([])

export const useWorkStore = () => {
  const setCurrentWork = (work) => {
    currentWork.value = work
  }

  const setWorks = (newWorks) => {
    works.value = newWorks
  }

  const clearCurrentWork = () => {
    currentWork.value = null
  }

  return {
    currentWork: readonly(currentWork),
    works: readonly(works),
    setCurrentWork,
    setWorks,
    clearCurrentWork
  }
}
