import { ref, readonly } from 'vue'

const currentWork = ref()
const works = ref([])

export const useWorkStore = () => {
  const setCurrentWork = (work) => {
    currentWork.value = work
  }

  const setWorks = (newWorks) => {
    works.value = newWorks
  }

  const clearCurrentWork = () => {
    currentWork.value = undefined
  }

  return {
    currentWork: readonly(currentWork),
    works: readonly(works),
    setCurrentWork,
    setWorks,
    clearCurrentWork
  }
}
