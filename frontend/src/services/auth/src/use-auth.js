import { ref, readonly } from 'vue'

const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)

const openLoginDialog = () => {
  showLoginDialog.value = true
  showRegisterDialog.value = false
}

const openRegisterDialog = () => {
  showRegisterDialog.value = true
  showLoginDialog.value = false
}

const closeDialogs = () => {
  showLoginDialog.value = false
  showRegisterDialog.value = false
}

const closeLoginDialog = () => {
  showLoginDialog.value = false
}

const closeRegisterDialog = () => {
  showRegisterDialog.value = false
}

export const useAuth = () => {
  return {
    showLoginDialog: readonly(showLoginDialog),
    showRegisterDialog: readonly(showRegisterDialog),
    openLoginDialog,
    openRegisterDialog,
    closeDialogs,
    closeLoginDialog,
    closeRegisterDialog,
  }
}
