import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js'
import { getRouter } from '@brugmann/vuemann/src/services/router/init/router-plugin.js'

describe('routerService.hasCurrentRouteParam', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    window.scrollTo = vi.fn();
    
    if (getRouter().currentRoute.value.path !== '/') {
      await getRouter().push('/')
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('retourne true si le param est présent dans params', async () => {
    getRouter().addRoute({ path: '/users/:id', name: 'user-show', component: { template: '<div />' } })

    await getRouter().push({ name: 'user-show', params: { id: '42' } })

    expect(routerService.hasCurrentRouteParam('id')).toBe(true)
  })

  it('retourne true si le param est présent dans query', async () => {
    getRouter().addRoute({ path: '/search', name: 'search', component: { template: '<div />' } })

    await getRouter().push({ name: 'search', query: { q: 'john' } })

    expect(routerService.hasCurrentRouteParam('q')).toBe(true)
  })

  it('retourne false si le param est absent', async () => {
    getRouter().addRoute({ path: '/blank', name: 'blank', component: { template: '<div />' } })

    await getRouter().push({ name: 'blank' })

    expect(routerService.hasCurrentRouteParam('missing')).toBe(false)
  })
})


