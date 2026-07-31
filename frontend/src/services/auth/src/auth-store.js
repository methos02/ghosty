import { ref, readonly, computed, inject, hasInjectionContext } from 'vue'

export const AUTH_STORE_KEY = Symbol('auth-store')

// @see backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
const state = {
  clientStore: undefined,
}

export const createAuthStore = () => {
  const user = ref()

  const hasRole = role => {
    if (!user.value?.roles) {
      return false
    }
    return user.value.roles.includes(role)
  }

  return {
    user: readonly(user),

    isAuthenticated: computed(() => Boolean(user.value)),
    isAuthor: computed(() => hasRole('author')),
    isModerator: computed(() => hasRole('moderator')),
    isAdmin: computed(() => hasRole('admin')),

    setUser: userData => {
      user.value = userData
    },

    clear: () => {
      user.value = undefined
    },

    hasRole,

    getCurrentUser: () => user.value ?? undefined,

    serialize: () => ({ user: user.value }),

    hydrate: data => {
      if (!data) {
        return
      }
      user.value = data.user
    },
  }
}

export const setClientAuthStore = store => {
  state.clientStore = store
}

export const useAuthStore = () => {
  if (hasInjectionContext()) {
    return inject(AUTH_STORE_KEY, state.clientStore)
  }

  return state.clientStore ?? createAuthStore()
}
