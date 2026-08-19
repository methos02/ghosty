/* eslint-disable no-console */

const send = async () => {}

const error = (message, ...arguments_) => {
  console.error('[Error]', message, ...arguments_)
}

const warn = (message, ...arguments_) => {
  console.warn('[Warning]', message, ...arguments_)
}

const info = (message, ...arguments_) => {
  console.info('[Info]', message, ...arguments_)
}

const debug = (message, ...arguments_) => {
  console.debug('[Debug]', message, ...arguments_)
}

export const log = {
  send,
  error,
  warn,
  info,
  debug,
}
