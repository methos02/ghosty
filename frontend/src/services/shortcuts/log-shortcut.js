/* eslint-disable no-console */

// Ghosty opt-out : pas de télémétrie backend, `send` reste un no-op.
// TODO: remplacer ce stub par le vrai service de log quand l'endpoint backend de logging sera créé.
const send = async () => {
  // no-op stub
}

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
