import { describe, it, expect, vi, afterEach } from 'vitest'
import { routerService } from '@/services/router/router-service.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('router-service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('hasRoute', () => {
    it('is true for a declared route name', () => {
      expect(routerService.hasRoute('home')).toBe(true)
    })

    it('is false for an unknown route name', () => {
      expect(routerService.hasRoute('does-not-exist')).toBe(false)
    })
  })

  describe('hasApiRoute', () => {
    it('is true for a declared API route (flat dotted key)', () => {
      expect(routerService.hasApiRoute('novel.list')).toBe(true)
      expect(routerService.hasApiRoute('work.vote')).toBe(true)
    })

    it('is false for an unknown API route', () => {
      expect(routerService.hasApiRoute('novel.unknown')).toBe(false)
    })
  })

  describe('resolve / getRoutes', () => {
    it('resolves the home route to its path', () => {
      expect(routerService.resolve({ name: 'home' }).path).toBe('/')
    })

    it('lists the registered routes', () => {
      const names = routerService.getRoutes().map(route => route.name)

      expect(names).toContain('home')
    })
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

  describe('push', () => {
    it('flashes an error when pushing an unknown named route', async () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      await routerService.push({ name: 'nope' })

      expect(errorT).toHaveBeenCalledWith('error_route_unknown', { route_name: 'nope' })
    })
  })

  describe('getCurrentRouteParam', () => {
    it('returns undefined for a param that is not present', () => {
      expect(routerService.getCurrentRouteParam('missing')).toBeUndefined()
      expect(routerService.hasCurrentRouteParam('missing')).toBe(false)
    })
  })
})
