/**
 * Utils contract
 * @typedef {Object} HydrateKeyConfig
 * @property {string} [controller]
 * @property {string} [method]
 * @property {(item: Record<string, unknown>) => boolean} [filter]
 *
 * @typedef {Object} UtilsService
 * @property {() => Promise<{status: boolean, error?: string}>} apiStatus
 * @property {(data: Array<Record<string, unknown>>, keys: string[], config?: Record<string, HydrateKeyConfig>) => Promise<Array<Record<string, unknown>>>} hydrate
 * @property {(message: string) => void} isDeprecated
 * @property {(version: string) => Promise<boolean>} needUpdate
 * @property {(name: string, controller: Record<string, unknown>) => void} registerController
 */
export {}
