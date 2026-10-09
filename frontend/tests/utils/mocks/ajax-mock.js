import { vi } from 'vitest'
import { ajax } from '@/services/shortcuts/ajax-shortcut.js'

export const ajaxMock = () => {
  vi.spyOn(ajax, 'req').mockImplementation(routeName => {
    throw new Error(
      `Appel d'une API réelle (route "${routeName}") pendant un test : moque la réponse (vi.spyOn sur le repository ou sur ajax.req).`,
    )
  })
}
