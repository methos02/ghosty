import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { describe, it, expect, afterEach } from 'vitest'

describe('routerService.hasApiRoute', () => {
    afterEach(() => {
        ConfigLoader.set('routesApi', {})
    })

    it('should return true if the route is an API route', () => {
        ConfigLoader.set('routesApi', { 'test': '/api/test' })
        
        const result = routerService.hasApiRoute('test')
        expect(result).toBe(true)
    })

    it('should return false if the route is not an API route', () => {
        const result = routerService.hasApiRoute('test')
        expect(result).toBe(false)
    })
})
