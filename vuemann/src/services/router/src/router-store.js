import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterStore = defineStore('router', () => {
  const urlIntented = ref('/')

  return { urlIntented }
})
