import { ref, readonly } from 'vue'
import api from '@/services/api'

const works = ref([])
const currentWork = ref(null)
const loading = ref(false)
const error = ref(null)

export const useWorks = () => {
  const fetchWorks = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get('/works', { params })
      works.value = data.data || data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWork = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get(`/works/${id}`)
      currentWork.value = data.data || data
      return currentWork.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createWork = async (workData) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/works', workData)
      works.value.unshift(data.work)
      return data.work
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWork = async (id, workData) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put(`/works/${id}`, workData)
      const index = works.value.findIndex(w => w.id === id)
      if (index !== -1) {
        works.value[index] = data.work
      }
      return data.work
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const voteWork = async (workId, value) => {
    try {
      const { data } = await api.post(`/works/${workId}/vote`, { value })
      return data
    } catch (err) {
      throw err
    }
  }

  return {
    works: readonly(works),
    currentWork: readonly(currentWork),
    loading: readonly(loading),
    error: readonly(error),
    fetchWorks,
    fetchWork,
    createWork,
    updateWork,
    voteWork
  }
}
