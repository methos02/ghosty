// Ghosty opt-out : pas de télémétrie backend. Stub no-op conservant la surface
// attendue par les autres services (ex. ajax-service.guardSkippedApi, flash).
// TODO: remplacer ce stub par le vrai service de log quand l'endpoint backend de logging sera créé.
const noop = () => {
  // no-op stub
}

export const log = {
  debug: noop,
  error: noop,
  info: noop,
  send: noop,
  warn: noop,
}
