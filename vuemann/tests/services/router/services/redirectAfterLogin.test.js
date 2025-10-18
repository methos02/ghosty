import {describe, expect, it, beforeEach, afterEach, vi, beforeAll} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { getRouter } from "@brugmann/vuemann/src/services/router/init/router-plugin.js";
import { useRouterStore } from "@brugmann/vuemann/src/services/router/src/router-store.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";

describe('router redirectAfterLogin', () => {
    beforeEach(() => {
        setActivePinia(createPinia()) 
        window.scrollTo = vi.fn();
    })
    afterEach(() => vi.resetAllMocks())

    it('redirectAfterLogin success', async () => {
        const routerStore = useRouterStore()
        routerStore.urlIntented = "/test"

        vi.spyOn(routerService, 'push')
        getRouter().addRoute({ path: "/test", component: { template: "<div>Test Page</div>" }, name: 'test'  })           

        await routerService.redirectAfterLogin()
        
        expect(routerService.push).toHaveBeenCalledOnce()
        expect(routerService.push).toHaveBeenCalledWith("/test")
        expect(getRouter().currentRoute.value.path).toBe('/test')
    })
})
