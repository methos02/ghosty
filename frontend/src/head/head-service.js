import { useHead } from '@unhead/vue'

const set = config => useHead(config)

export const headService = { set }
