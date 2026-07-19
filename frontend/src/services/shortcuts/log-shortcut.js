// Ghosty opt-out : pas de télémétrie backend. Stub no-op conservant la surface
// attendue par les autres services (ex. ajax-service.guardSkippedApi, flash).
export const log = {
  debug: () => {},
  error: () => {},
  info: () => {},
  send: async () => {},
  warn: () => {},
}
