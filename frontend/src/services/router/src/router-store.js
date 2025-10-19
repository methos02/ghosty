import { ref } from 'vue'

// État global (hors fonction = partagé entre tous les composants)
const urlIntented = ref('/')

// Fonction get() pour compatibilité avec l'ancien code
const get = () => {
  return {
    urlIntented: urlIntented.value
  }
}

const setUrlIntented = (url) => {
  urlIntented.value = url
}

const getUrlIntented = () => {
  return urlIntented.value
}

export const routerStore = {
  get,
  setUrlIntented,
  getUrlIntented,
  urlIntented
}
