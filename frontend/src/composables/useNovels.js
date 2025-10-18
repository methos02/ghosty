import { ref, readonly } from 'vue'
import api from '@/services/api'

// État global
const novels = ref([])
const currentNovel = ref(null)
const loading = ref(false)
const error = ref(null)

export const useNovels = () => {
  const fetchNovels = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get('/novels', { params })
      novels.value = data.data || data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des romans'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchNovel = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get(`/novels/${id}`)
      currentNovel.value = data.data || data
      return currentNovel.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du roman'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNovel = async (novelData) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/novels', novelData)
      novels.value.unshift(data.novel)
      return data.novel
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du roman'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNovel = async (id, novelData) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put(`/novels/${id}`, novelData)
      const index = novels.value.findIndex(n => n.id === id)
      if (index !== -1) {
        novels.value[index] = data.novel
      }
      if (currentNovel.value?.id === id) {
        currentNovel.value = data.novel
      }
      return data.novel
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNovel = async (id) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/novels/${id}`)
      novels.value = novels.value.filter(n => n.id !== id)
      if (currentNovel.value?.id === id) {
        currentNovel.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPopular = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get('/novels/popular')
      return data.data || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    novels: readonly(novels),
    currentNovel: readonly(currentNovel),
    loading: readonly(loading),
    error: readonly(error),
    fetchNovels,
    fetchNovel,
    createNovel,
    updateNovel,
    deleteNovel,
    fetchPopular
  }
}
