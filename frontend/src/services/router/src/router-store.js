import { ref } from 'vue'

const urlIntented = ref('/')

export const useRouterStore = () => {
  return { urlIntented }
}
