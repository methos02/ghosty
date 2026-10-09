import { describe, it, expect } from 'vitest'
import { routerService } from '@/services/router/router-service.js'

describe('router-service', () => {
  describe('hasApiRoute', () => {
    it('is true for a declared API route (flat dotted key)', () => {
      expect(routerService.hasApiRoute('novel.list')).toBe(true)
      expect(routerService.hasApiRoute('auth.login')).toBe(true)
    })

    it('is false for an unknown API route', () => {
      expect(routerService.hasApiRoute('novel.unknown')).toBe(false)
    })
  })
})
