import { describe, it, expect } from 'vitest'
import { routerService } from '@/services/router/router-service.js'

describe('router-service', () => {
  describe('resolve', () => {
    it('resolves the home route to its path', () => {
      expect(routerService.resolve({ name: 'home' }).path).toBe('/')
    })
  })
})
