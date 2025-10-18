import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js'
import { getRouter } from '@brugmann/vuemann/src/services/router/init/router-plugin.js'
import { describe, it, expect, afterEach } from 'vitest'

describe('routerService.hasRoute', () => {
    afterEach(() => {
        const router = getRouter()
        if (router.hasRoute('test-route')) {
            router.removeRoute('test-route')
        }
        if (router.hasRoute('parent-route')) {
            router.removeRoute('parent-route')
        }
    })

    it('should return true if the route exists', () => {
        // Ajoute une route de test
        getRouter().addRoute({
            path: '/test',
            name: 'test-route',
            component: { template: '<div>Test</div>' }
        })

        const result = routerService.hasRoute('test-route')
        expect(result).toBe(true)
    })

    it('should return false if the route does not exist', () => {
        const result = routerService.hasRoute('non-existent-route')
        expect(result).toBe(false)
    })

    it('should return false for empty string', () => {
        const result = routerService.hasRoute('')
        expect(result).toBe(false)
    })

    it('should return false for undefined route name', () => {
        const result = routerService.hasRoute(undefined)
        expect(result).toBe(false)
    })

    it('should return false for null route name', () => {
        const result = routerService.hasRoute(null)
        expect(result).toBe(false)
    })

    it('should work with routes that have children', () => {
        // Ajoute une route parent avec enfants
        getRouter().addRoute({
            path: '/parent',
            name: 'parent-route',
            component: { template: '<div>Parent</div>' },
            children: [
                {
                    path: 'child',
                    name: 'child-route',
                    component: { template: '<div>Child</div>' }
                }
            ]
        })

        expect(routerService.hasRoute('parent-route')).toBe(true)
        expect(routerService.hasRoute('child-route')).toBe(true)
        
        // Nettoie la route parent (qui supprime aussi les enfants)
        getRouter().removeRoute('parent-route')
    })
}) 
