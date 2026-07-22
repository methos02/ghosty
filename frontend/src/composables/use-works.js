import { ref, readonly } from 'vue'
import { WorkController } from '@/apis/works/controllers/work-controller.js'
import { UTILS } from '@/constants/utils-constants.js'
import { STATUS } from '@/constants/ajax-constants.js'

const works = ref([])
const currentWork = ref()

const voteWork = (id, value) => WorkController.vote(id, value)

export const useWorks = () => {
  const fetchWorks = async (filters = {}) => {
    const response = await WorkController.list(filters)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    works.value = response.works
    return response
  }

  const fetchWork = async id => {
    const response = await WorkController.getById(id)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    currentWork.value = response.work
    return response
  }

  const createWork = async workData => {
    const response = await WorkController.create(workData)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    works.value.unshift(response.work)
    return response
  }

  const updateWork = async (id, workData) => {
    const response = await WorkController.update(id, workData)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    const index = works.value.findIndex(work => work.id === id)
    if (index !== UTILS.FIND_NOT_FOUND) {
      works.value[index] = response.work
    }
    return response
  }

  return {
    works: readonly(works),
    currentWork: readonly(currentWork),
    fetchWorks,
    fetchWork,
    createWork,
    updateWork,
    voteWork,
  }
}
