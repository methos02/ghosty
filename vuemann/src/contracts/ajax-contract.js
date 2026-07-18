/**
 * Ajax contract
 * @typedef {Object} AjaxRequestOptions
 * @property {Record<string, unknown>} [params]
 * @property {Record<string, unknown>} [body]
 * @property {string} [api]
 * @property {string} [responseType]
 * @property {boolean} [flash]
 * @property {boolean} [log]
 *
 * @typedef {Object} AjaxResponse
 * @property {number} status
 * @property {unknown} [data]
 * @property {string} [api]
 * @property {string} [route]
 *
 * @typedef {Object} AjaxService
 * @property {(routeName: string, params?: Record<string, unknown>) => string} generateSubdirectoryFromRouteName
 * @property {(routeName: string, params?: Record<string, unknown>, api?: string) => string} generateUrlFromRouteName
 * @property {(routeName: string, options?: AjaxRequestOptions) => Promise<AjaxResponse>} req
 */
export {}
