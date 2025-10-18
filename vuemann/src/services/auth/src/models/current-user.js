import { authStore } from "@brugmann/vuemann/src/services/auth/auth-store.js"

const init = () => {
    const localUser = localStorage.getItem('current_user')
    if(localUser === null) { return false }

    authStore.setCurrentUser(localUser)
    return true
}

const has = () => {
    return localStorage.getItem('current_user') !== null
}

const set = username => {
    username = username.toUpperCase()
    authStore.setCurrentUser(username)
    localStorage.setItem('current_user', username)
}

const get = () => {
    return authStore.getCurrentUser()
}

const remove = () => {
    localStorage.removeItem('current_user')
    return authStore.removeCurrentUser()
}

export const currentUser = { init, has, set, get, remove }
