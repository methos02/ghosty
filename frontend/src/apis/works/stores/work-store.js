import { ref, readonly, inject } from 'vue'

export const WORK_STORE_KEY = Symbol('work-store')

export const createWorkStore = () => {
  const currentWork = ref()
  const works = ref([])

  const setCurrentWork = work => {
    currentWork.value = work
  }

  const setWorks = newWorks => {
    works.value = newWorks
  }

  const clearCurrentWork = () => {
    currentWork.value = undefined
  }

  const serialize = () => ({
    currentWork: currentWork.value,
    works: works.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    currentWork.value = data.currentWork
    works.value = data.works ?? []
  }

  return {
    currentWork: readonly(currentWork),
    works: readonly(works),
    setCurrentWork,
    setWorks,
    clearCurrentWork,
    serialize,
    hydrate,
  }
}

export const useWorkStore = () => inject(WORK_STORE_KEY)
