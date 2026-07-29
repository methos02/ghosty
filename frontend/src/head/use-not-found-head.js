import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useNotFoundHead = () => {
  headService.set({
    title: t('not_found.title'),
    meta: [{ name: 'robots', content: 'noindex' }],
  })
}
