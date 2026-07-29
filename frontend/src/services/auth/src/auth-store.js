import { ref, readonly, computed } from 'vue'
import { ssrStorage } from '@/helpers/ssr-storage.js'

const user = ref()
const token = ref()

const storedToken = ssrStorage.getItem('auth_token')
const storedUser = ssrStorage.getItem('auth_user')

if (storedToken && storedUser) {
  token.value = storedToken
  user.value = JSON.parse(storedUser)
}

export const authStore = {
  user: readonly(user),
  token: readonly(token),

  isAuthenticated: computed(() => Boolean(user.value) && Boolean(token.value)),
  isAuthor: computed(() => user.value?.roles?.includes('author') || false),
  isModerator: computed(() => user.value?.roles?.includes('moderator') || false),
  isAdmin: computed(() => user.value?.roles?.includes('admin') || false),

  setUser: userData => {
    user.value = userData
    ssrStorage.setItem('auth_user', JSON.stringify(userData))
  },

  unsetUser: () => {
    user.value = undefined
    ssrStorage.removeItem('auth_user')
  },

  setToken: tokenData => {
    token.value = tokenData
    ssrStorage.setItem('auth_token', tokenData)
  },

  unsetToken: () => {
    token.value = undefined
    ssrStorage.removeItem('auth_token')
  },

  clear: () => {
    user.value = undefined
    token.value = undefined
    ssrStorage.removeItem('auth_token')
    ssrStorage.removeItem('auth_user')
  },

  hasRole: role => {
    if (!user.value?.roles) {
      return false
    }
    return user.value.roles.includes(role)
  },

  getCurrentUser: () => user.value ?? undefined,
}
