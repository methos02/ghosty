/**
 * Log contract
 * @typedef {Object} LogService
 * @property {(error: Error | string, context?: Object) => Promise<void>} send
 * @property {(message: unknown, ...rest: unknown[]) => void} error
 * @property {(message: unknown, ...rest: unknown[]) => void} warn
 * @property {(message: unknown, ...rest: unknown[]) => void} info
 * @property {(message: unknown, ...rest: unknown[]) => void} debug
 */
export {}
