import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { useRouterStore } from "@brugmann/vuemann/src/services/router/src/router-store.js";
import { routerFunctions } from "@brugmann/vuemann/src/services/router/src/router-functions.js";
import { flushPromises } from "@vue/test-utils";
import { utilsService } from "@brugmann/vuemann/src/services/utils/init/utils-service.js";
import { authService } from "@brugmann/vuemann/src/services/auth/init/auth-service.js";

describe('router beforEach', () => {
    beforeEach(() => setActivePinia(createPinia()) )
    afterEach(() => vi.resetAllMocks() )

    const to = { name: 'someProtectedRoute', matched: [], fullPath: '/test' };
    const from = {};
    const next = vi.fn();

    it('name route is error', async () => {
        await routerFunctions.beforeEach({ name: 'error'}, from, next)
        expect(next).toHaveBeenCalledOnce()
    })

    it('apis status failed', async () => {
        vi.spyOn(utilsService, 'apiStatus').mockResolvedValue(false)
            
        await routerFunctions.beforeEach(to, from, next)
        await flushPromises()

        expect(next).toHaveBeenCalledExactlyOnceWith('/error')
    })

    it('with multi match', async () => {
        vi.spyOn(utilsService, 'apiStatus').mockResolvedValue(true)
        vi.spyOn(authService, 'routesAuthCheck').mockResolvedValue(true)
            
        to.matched.push({})
        to.matched.push({ meta: { auth: 'testApi' } })
        await routerFunctions.beforeEach(to, from, next)
        await flushPromises()
  
        expect(next).toHaveBeenCalledExactlyOnceWith()
    })
})
