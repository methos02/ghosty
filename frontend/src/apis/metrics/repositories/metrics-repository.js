import { req } from '@/services/shortcuts/services-shortcut.js'

const show = async options => {
  return await req('metrics.show', options)
}

export const MetricsRepository = {
  show,
}
