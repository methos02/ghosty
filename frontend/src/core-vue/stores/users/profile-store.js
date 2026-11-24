import { ref, readonly, inject } from 'vue'

export const PROFILE_STORE_KEY = Symbol('profile-store')

const profileStore = () => {
  const profile = ref()

  const setProfile = value => {
    profile.value = value
  }

  const clear = () => {
    profile.value = undefined
  }

  const serialize = () => {
    return { profile: profile.value }
  }

  const hydrate = data => {
    if (!data) {
      return
    }
    profile.value = data.profile
  }

  return {
    profile: readonly(profile),
    setProfile,
    clear,
    serialize,
    hydrate,
  }
}

export const createProfileStore = () => profileStore()

export const useProfileStore = () => inject(PROFILE_STORE_KEY)
