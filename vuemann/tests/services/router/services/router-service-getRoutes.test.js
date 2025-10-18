import {describe, expect, it, beforeEach, afterEach, vi, beforeAll} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { getRouter } from "@brugmann/vuemann/src/services/router/init/router-plugin.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";

describe('router getRoutes', () => {
    beforeEach(() => setActivePinia(createPinia()) )
    afterEach(() => vi.resetAllMocks())

    it('should return all routes from router', () => {
        // Ajouter quelques routes de test
        const testRoutes = [
            { path: '/test1', name: 'test1', component: { template: '<div>Test 1</div>' } },
            { path: '/test2', name: 'test2', component: { template: '<div>Test 2</div>' } },
            { path: '/test3', name: 'test3', component: { template: '<div>Test 3</div>' } }
        ];

        // Ajouter les routes au router
        testRoutes.forEach(route => {
            getRouter().addRoute(route);
        });

        // Récupérer toutes les routes via le service
        const routes = routerService.getRoutes();

        // Vérifier que toutes nos routes de test sont présentes
        expect(routes).toBeDefined();
        expect(Array.isArray(routes)).toBe(true);
        
        testRoutes.forEach(testRoute => {
            expect(routes.some(route => route.name === testRoute.name)).toBe(true);
        });

        // Nettoyer les routes de test
        testRoutes.forEach(route => {
            getRouter().removeRoute(route.name);
        });
    });

    it('should return empty array when no routes exist', () => {
        // Sauvegarder les routes existantes
        const existingRoutes = getRouter().getRoutes().slice();
        
        // Supprimer toutes les routes existantes
        existingRoutes.forEach(route => {
            if (route.name) {
                getRouter().removeRoute(route.name);
            }
        });

        const routes = routerService.getRoutes();
        
        expect(routes).toBeDefined();
        expect(Array.isArray(routes)).toBe(true);
        expect(routes.length).toBe(0);

        // Restaurer les routes existantes
        existingRoutes.forEach(route => {
            getRouter().addRoute(route);
        });
    });

    it('should return routes with metadata when filtering by sidebar', () => {
        // Ajouter des routes avec metadata sidebar
        const routesWithSidebar = [
            { 
                path: '/sidebar1', 
                name: 'sidebar1', 
                component: { template: '<div>Sidebar 1</div>' },
                meta: { sidebar: { label: 'Sidebar 1', icon: 'fa-home', order: 1 } }
            },
            { 
                path: '/sidebar2', 
                name: 'sidebar2', 
                component: { template: '<div>Sidebar 2</div>' },
                meta: { sidebar: { label: 'Sidebar 2', icon: 'fa-user', order: 2 } }
            },
            { 
                path: '/no-sidebar', 
                name: 'no-sidebar', 
                component: { template: '<div>No Sidebar</div>' }
            }
        ];

        // Ajouter les routes au router
        routesWithSidebar.forEach(route => {
            getRouter().addRoute(route);
        });

        const allRoutes = routerService.getRoutes();
        
        // Filtrer les routes avec sidebar comme dans HeaderComponent
        const sidebarRoutes = allRoutes.filter(route => route.meta?.sidebar);

        expect(sidebarRoutes.length).toBe(2);
        expect(sidebarRoutes.every(route => route.meta && route.meta.sidebar)).toBe(true);

        // Vérifier l'ordre
        const sortedRoutes = sidebarRoutes.sort((a, b) => a.meta.sidebar.order - b.meta.sidebar.order);
        expect(sortedRoutes[0].name).toBe('sidebar1');
        expect(sortedRoutes[1].name).toBe('sidebar2');

        // Nettoyer les routes de test
        routesWithSidebar.forEach(route => {
            getRouter().removeRoute(route.name);
        });
    });
}); 
