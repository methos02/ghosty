import { describe, it, expect } from 'vitest'
import { routerService } from '@/services/router/router-service.js'

describe('router-service', () => {
  describe('getCurrentRouteParam', () => {
    it('returns undefined for a param that is not present', () => {
      expect(routerService.getCurrentRouteParam('missing')).toBeUndefined()
      expect(routerService.hasCurrentRouteParam('missing')).toBe(false)
    })
  })
})
