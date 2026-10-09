import { describe, it, expect } from 'vitest'
import { routerService } from '@/services/router/router-service.js'

describe('router-service', () => {
  describe('getRoutes', () => {
    it('lists the registered routes', () => {
      const names = routerService.getRoutes().map(route => route.name)

      expect(names).toContain('home')
    })
  })
})
