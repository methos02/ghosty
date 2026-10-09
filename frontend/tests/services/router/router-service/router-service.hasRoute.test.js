import { describe, it, expect } from 'vitest'
import { routerService } from '@/services/router/router-service.js'

describe('router-service', () => {
  describe('hasRoute', () => {
    it('is true for a declared route name', () => {
      expect(routerService.hasRoute('home')).toBe(true)
    })

    it('is false for an unknown route name', () => {
      expect(routerService.hasRoute('does-not-exist')).toBe(false)
    })
  })
})
