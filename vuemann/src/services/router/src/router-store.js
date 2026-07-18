import { ref } from 'vue'

// State global partagé
const urlIntented = ref('/')

export const useRouterStore = () => {
  return { urlIntented }
}
