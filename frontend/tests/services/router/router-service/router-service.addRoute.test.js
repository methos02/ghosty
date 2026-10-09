import { describe, it, expect, vi, afterEach } from 'vitest'
import { routerService } from '@/services/router/router-service.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('router-service', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('addRoute', () => {
    it('adds a valid route to the router', () => {
      const added = routerService.addRoute({
        path: '/added',
        name: 'added',
        component: { template: '<div />' },
      })

      expect(added).toBe(true)
      expect(routerService.hasRoute('added')).toBe(true)
    })

    it('flashes an error when the path is missing', () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      routerService.addRoute({ name: 'broken', component: {} })

      expect(errorT).toHaveBeenCalledWith('error_route_path')
    })

    it('flashes an error when the component is missing', () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      routerService.addRoute({ path: '/broken' })

      expect(errorT).toHaveBeenCalledWith('error_route_component', { url: '/broken' })
    })
  })
})
