import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('login', () => {
  const username = ref()
  const password = ref()
  const errorAuth = ref()
  const currentUser = ref()
  const currentUserRoles = ref([])

  return { username, password, errorAuth, currentUser, currentUserRoles }
})

let store
const get = () => {
  if(store === undefined) { store = useAuthStore() }
  return store
}

const setCurrentUser = username => {
  authStore.get().currentUser = username
}

const getCurrentUser = () => {
  return authStore.get().currentUser
}

const removeCurrentUser = () => {
  authStore.get().currentUser = undefined
  authStore.get().currentUserRoles = []
  return true
}

const setCurrentUserRoles = roles => {
  authStore.get().currentUserRoles = roles
}

const getCurrentUserRoles = () => {
  return authStore.get().currentUserRoles
}

export const authStore = { get, setCurrentUser, getCurrentUser, removeCurrentUser, setCurrentUserRoles, getCurrentUserRoles }
