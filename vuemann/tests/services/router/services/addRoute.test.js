import {describe, expect, it, beforeEach, afterEach, vi, beforeAll} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { getRouter } from "@brugmann/vuemann/src/services/router/init/router-plugin.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";
import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js";
import { t } from "@brugmann/vuemann/src/services/services-helper";

describe('router addRoute', () => {
    beforeEach(() => setActivePinia(createPinia()) )
    afterEach(() => vi.resetAllMocks())

    it('without path', async () => {
        const errorMock = vi.spyOn(flashService, 'error').mockReturnValue(false)
        routerService.addRoute({ component: { template: "<div>Test Page</div>" }})

        expect(errorMock).toHaveBeenCalledExactlyOnceWith(t('error_route_path'))
    })

    it('without component', async () => {
        const errorMock = vi.spyOn(flashService, 'error').mockReturnValue(false)
        routerService.addRoute({ path: "/test"})

        expect(errorMock).toHaveBeenCalledExactlyOnceWith(t('error_route_component', {url : "/test"}))
    })

    it('addRoute success', async () => {
        expect(getRouter().hasRoute('test')).toBe(false)
        routerService.addRoute({ path: "/test", component: { template: "<div>Test Page</div>" }, name: 'test'  })

        expect(getRouter().hasRoute('test')).toBe(true)
        getRouter().removeRoute('test')
    })
})
