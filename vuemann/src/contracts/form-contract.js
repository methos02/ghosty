/**
 * Form contract
 * @typedef {Object} FormValidationResult
 * @property {boolean} valid
 * @property {Record<string, unknown>} datas
 * @property {Record<string, string>} errors
 *
 * @typedef {Object} FormService
 * @property {(params: Record<string, unknown>, currentDatas: Record<string, unknown>, options?: Record<string, unknown>) => FormValidationResult} validateForm
 * @property {() => Record<string, string>} getErrors
 * @property {(inputName: string) => string | undefined} getError
 * @property {(inputName: string) => boolean} hasError
 * @property {(inputName: string, errorKey: string) => void} addError
 * @property {(inputName: string) => void} clearError
 * @property {() => void} clearErrors
 */
export {}
