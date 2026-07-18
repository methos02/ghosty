/**
 * Router contract
 * @typedef {Object} RouterService
 * @property {(route: import('vue-router').RouteRecordRaw) => boolean | undefined} addRoute
 * @property {() => import('vue').Ref<import('vue-router').RouteLocationNormalizedLoaded>} currentRoute
 * @property {(paramName: string) => string | string[] | undefined} getCurrentRouteParam
 * @property {(routeName: string) => import('vue-router').RouteLocation} getRoute
 * @property {() => import('vue-router').RouteRecordNormalized[]} getRoutes
 * @property {(routeName: string) => boolean} hasApiRoute
 * @property {(paramName: string) => boolean} hasCurrentRouteParam
 * @property {(routeName: string) => boolean} hasRoute
 * @property {(route: import('vue-router').RouteLocationRaw) => Promise<boolean | undefined>} push
 * @property {() => Promise<void>} redirectAfterLogin
 * @property {(route: import('vue-router').RouteLocationRaw) => Promise<boolean | undefined>} replace
 * @property {(route: import('vue-router').RouteLocationRaw) => import('vue-router').RouteLocation & { href: string }} resolve
 * @property {(url: string) => void} setUrlIntented
 */
export {}
