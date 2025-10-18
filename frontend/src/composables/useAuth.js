import { ref, readonly, computed } from 'vue'
import api from '@/services/api'

// État global (singleton pattern avec composables globaux)
const user = ref(null)
const token = ref(null)
const loading = ref(false)
const error = ref(null)

// Initialiser depuis localStorage
const storedToken = localStorage.getItem('auth_token')
const storedUser = localStorage.getItem('auth_user')

if (storedToken && storedUser) {
  token.value = storedToken
  user.value = JSON.parse(storedUser)
}

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAuthor = computed(() => user.value?.role >= 2)
  const isModerator = computed(() => user.value?.role >= 3)
  const isAdmin = computed(() => user.value?.role === 4)

  const setAuthData = (userData, tokenData) => {
    user.value = userData
    token.value = tokenData
    localStorage.setItem('auth_token', tokenData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const register = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/auth/register', credentials)
      setAuthData(data.user, data.token)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/auth/login', credentials)
      setAuthData(data.user, data.token)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuthData()
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return

    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    } catch (err) {
      clearAuthData()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    isAuthor,
    isModerator,
    isAdmin,
    register,
    login,
    logout,
    fetchCurrentUser
  }
}
