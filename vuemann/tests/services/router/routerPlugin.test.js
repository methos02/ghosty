import { describe, it, expect } from 'vitest';
import { routerPlugin, getRouter } from '@brugmann/vuemann/src/services/router/init/router-plugin.js';

describe('routerPlugin', () => {
    it('should create a new router instance if not already created', async () => {
        const router = routerPlugin();
        expect(router.listening).toBe(true)
    });

    it('should return the same router instance if already created', async () => {
        const router1 = routerPlugin();
        const router2 = routerPlugin();

        expect(router1).toBe(router2);
    });

    it('should return the router instance when calling getRouter', async () => {
        const router = routerPlugin();
        expect(getRouter()).toBe(router);
    });
});
