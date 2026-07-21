// Ghosty opt-out : pas de features temps réel. Stub no-op.
// TODO: remplacer ce stub par le vrai service WebSocket quand le temps réel (endpoint backend) sera ajouté.
const noop = () => {
  // no-op stub
}

export const ws = {
  clear: noop,
  clearQueue: noop,
  close: noop,
  exist: () => false,
  get: noop,
  lastEvent: noop,
  open: noop,
  register: noop,
}
