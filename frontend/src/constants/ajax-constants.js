export const STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  ERROR_SERVER: 500,
}

export const DEFAULT_ERRORS = {
  [STATUS.BAD_REQUEST]: 'error_bad_request',
  [STATUS.FORBIDDEN]: 'error_forbidden',
  [STATUS.NOT_FOUND]: 'error_not_found',
  [STATUS.CONFLICT]: 'error_conflict',
  [STATUS.UNPROCESSABLE_ENTITY]: 'error_unprocessable',
  [STATUS.ERROR_SERVER]: 'error_server',
}

export const ERROR_UNKNOWN = 'error_unknown'
