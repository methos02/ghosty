import { describe, it, expect, vi, afterEach } from 'vitest'
import { routerService } from '@/services/router/router-service.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

describe('router-service', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('push', () => {
    it('flashes an error when pushing an unknown named route', async () => {
      const errorT = vi.spyOn(flash, 'errorT').mockImplementation(() => {})

      await routerService.push({ name: 'nope' })

      expect(errorT).toHaveBeenCalledWith('error_route_unknown', { route_name: 'nope' })
    })
  })
})
