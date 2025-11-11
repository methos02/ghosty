import { ref, readonly, computed } from 'vue'

const user = ref()
const token = ref()

const storedToken = localStorage.getItem('auth_token')
const storedUser = localStorage.getItem('auth_user')

if (storedToken && storedUser) {
  token.value = storedToken
  user.value = JSON.parse(storedUser)
}

export const authStore = {
  user: readonly(user),
  token: readonly(token),

  isAuthenticated: computed(() => !!user.value && !!token.value),
  isAuthor: computed(() => user.value?.roles?.includes('author') || false),
  isModerator: computed(() => user.value?.roles?.includes('moderator') || false),
  isAdmin: computed(() => user.value?.roles?.includes('admin') || false),

  setUser: (userData) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  },

  unsetUser: () => {
    user.value = null
    localStorage.removeItem('auth_user')
  },

  setToken: (tokenData) => {
    token.value = tokenData
    localStorage.setItem('auth_token', tokenData)
  },

  unsetToken: () => {
    token.value = null
    localStorage.removeItem('auth_token')
  },

  clear: () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  hasRole: (role) => {
    if (!user.value?.roles) return false
    return user.value.roles.includes(role)
  }
}
