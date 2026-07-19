// Ghosty opt-out : pas de features temps réel. Stub no-op.
export const ws = {
  clear: () => {},
  clearQueue: () => {},
  close: () => {},
  exist: () => false,
  get: () => undefined,
  lastEvent: () => undefined,
  open: () => {},
  register: () => {},
}
