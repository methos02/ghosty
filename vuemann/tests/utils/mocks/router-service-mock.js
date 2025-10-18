import { vi } from 'vitest';

export const routerServiceMock = {
    hasApiRoute: vi.fn(),
    addRoute: vi.fn(),
    currentRoute: vi.fn().mockReturnValue({value: {name: 'home', meta: {}}}),
    getCurrentRouteParam: vi.fn(),
    getRoute: vi.fn(),
    getRoutes: vi.fn().mockReturnValue([]),
    push: vi.fn(),
    redirectAfterLogin: vi.fn(),
}


