import { describe, it, beforeEach, expect, vi, beforeAll, afterEach } from "vitest";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";
import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js";
import { createPinia, setActivePinia } from "pinia";
import { getRouter } from "@brugmann/vuemann/src/services/router/init/router-plugin.js";
import { flushPromises } from "@vue/test-utils";

describe('router push', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        window.scrollTo = vi.fn();
    })
    afterEach(() => vi.resetAllMocks())

    it('url push success', async () => {
        expect(getRouter().currentRoute.value.path).toBe('/')
        getRouter().addRoute({ path: "/url", component: { template: "<div>Test Page</div>" }, name: 'test'  })

        routerService.push('/url')
        await flushPromises()

        expect(getRouter().currentRoute.value.path).toBe('/url')
    })

    it("route doesn't existe", async () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        routerService.push({name : 'route_unknow'})
        await flushPromises()

        expect(flashService.error).toHaveBeenCalledOnce()
    })

    it('route push success', async () => {
        expect(getRouter().currentRoute.value.path).toBe('/url')
        getRouter().addRoute({ path: "/route", component: { template: "<div>Test Page</div>" }, name: 'route'  })

        routerService.push({name : 'route'})
        await flushPromises()

        expect(getRouter().currentRoute.value.path).toBe('/route')
    })
})
